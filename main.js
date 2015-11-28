$(function(){
  var showed = false;
  var entries = {};
  var entries_ids = [];
  var wave_colors = d3.scale.linear().domain([-1, 0, 1]).range(["#178BCA", "white", "#FFDDDD"]);
  var wave_id = 0;

  $( "body" ).append( $( "<div></div>", {
    id: "effect-area"
  }).css( {
    "position": "absolute",
    "top": "0",
    "left": "0",
    "height": "100%",
    "width": "100%"
  } ) );

  $( ".entry-unit[data-eid]")
    .each( function(){
      var $users = $( this ).find( ".users" )
        .css( {
          "position": "relative",
          "z-index": "1"
        } );

      entries[ $( this ).attr( "data-eid" ) ] = {
        id: $( this ).attr( "data-eid" ),
        users_num: $users.find( "span" ).text(),
        url: $( this ).find( ".entry-contents a" ).attr( "href" ),
        svg_height: $users.height(),
        svg_width: $users.width(),
        dom: this,
      };

      entries_ids.push( $( this ).attr( "data-eid" ) );
    } );


  chrome.runtime.onMessage.addListener( function( request ) {
    if( showed ) return ;
    if( request.type != "batloika_clicked" ) return ;

    var i = 0;

    for( var entry_id in entries ){
      $.ajax( {
        type: "POST",
        url: "http://210.140.71.3:8080/negaposi",
        dataType: "json",
        data : {
          "urls": [
            entries[ entries_ids[ i++ ] ].url
          ]
        },
        success: function( json ){
          setWave( json.pages[0], entries[ json.pages[ 0 ].entry_id ] );
        },
        error: function( err ){
          console.log( err );
        }
      } );
    }

    showed = true;
  } );

  function setWave( result, entry ){
    var d3_svg = d3.select( entry.dom )
        .append( "svg" )
        .attr( "id", "wave-" + wave_id )
        .style( {
          "position": "absolute",
          "top": "0",
          "left": "0",
          "width": entry.svg_width,
          "height": entry.svg_height,
          "z-index": "0"
        } );

    var config = liquidFillGaugeDefaultSettings();
    config.waveColor = wave_colors( result.scores.average );
    config.waveAnimateTime = 1000 * result.nega_posi_words_num;
    var wave = loadLiquidFillGauge("wave-" + wave_id, 50, config, entry.users_num);

    $( entry.dom ).find( ".users li" )
      .css( "opacity", "0" );

    $( entry.dom ).append( $( "<button></button>", {
      "class": "show-comment"
    } ).css( {
      "display": "block",
      "position": "absolute",
      "top": "10px",
      "right": "42px",
      "height": "25px",
      "z-index": "2"
    } ).text( "コメントを表示" ) );

    $( entry.dom ).find( ".show-comment" )
      .click( function(){
        result.posi_words.forEach( function( word ){
          showComment( word );
        } );
        result.nega_words.forEach( function( word ){
          showComment( word );
        } );
      } );

    wave_id ++;
  }

  function showComment( comment ){
    $( "#effect-area" ).append( $( "<div></div>", {
      "class": "comment"
    } ).text( comment ) );
  }
});


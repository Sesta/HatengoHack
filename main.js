$(function(){
  var showed = false;
  var entries = {};
  var entries_ids = [];
  var wave_colors = d3.scale.linear().domain([-1, 0, 1]).range(["#178BCA", "white", "#FFDDDD"]);
  var text_colors = d3.scale.linear().domain([-1, 1]).range(["#178BCA", "#FFDDDD"]);
  var wave_text_colors = d3.scale.linear().domain([-1, 1]).range(["#A4DBf8", "#FFAAAA"]);
  var wave_id = 0;
  var image_urls = {
    posi: chrome.extension.getURL( "images/posi.png" ),
    nega: chrome.extension.getURL( "images/nega.png" ),
    batloika: chrome.extension.getURL( "images/batloika.png" )
  };

  $( "body" ).append( $( "<div></div>", {
    id: "effect-area"
  }).css( {
    "position": "absolute",
    "top": "0",
    "left": "0",
    "height": "100%",
    "width": "100%",
    "pointer-events": "none"
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
        button_x: $( this ).position().left * 1.0 + $( this ).width() - 100,
        button_y: $( this ).position().top * 1.0 + 20
      };

      entries_ids.push( $( this ).attr( "data-eid" ) );
    } );

  chrome.runtime.onMessage.addListener( function( request ) {
    if( showed ) return ;
    if( request.type != "batloika_clicked" ) return ;

    var i = 0;

    setInterval( function(){
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
    }, 500 );

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
    if( result.scores.average > 0 ){
      config.textColor = "#FF4444";
      config.waveTextColor = "#FFAAAA";
    }
    config.waveAnimateTime = 1000 + 10000.0 / result.nega_posi_words_num;
    var wave = loadLiquidFillGauge("wave-" + wave_id, 50, config, entry.users_num);

    $( entry.dom ).find( ".users li" )
      .css( "opacity", "0" );

    $( entry.dom ).append( $( "<img>", {
      "class": "show-comment",
      "src": image_urls.batloika
    } ).css( {
      "display": "block",
      "position": "absolute",
      "top": "10px",
      "right": "42px",
      "height": "25px",
      "z-index": "2",
      "cursor": "pointer"
    } ) );

    var comment_range = Math.sqrt( result.nega_posi_words_num ) * 50 + 100;

    $( entry.dom ).find( ".show-comment" )
      .click( function(){
        result.posi_words.forEach( function( word, index ){
          showComment( word, "posi", entry.button_x + comment_range * ( Math.random() - 0.5 ), entry.button_y + comment_range * ( Math.random() - 0.5 ), index );
        } );
        result.nega_words.forEach( function( word, index ){
          showComment( word, "nega", entry.button_x + comment_range * ( Math.random() - 0.5 ), entry.button_y + comment_range * ( Math.random() - 0.5 ), index );
        } );
      } );

    wave_id ++;
  }

  function showComment( comment, nega_or_posi, pos_x, pos_y, index ){
    var width = 100;

    var $div = $( "<div></div>", {
      "class": "comment"
    } ).css( {
      "display": "none",
      "position": "absolute",
      "top": pos_y + "px",
      "left": pos_x + "px",
      "width": width + "px"
    } );

    $div.append( $( "<img>", {
      "src": image_urls[ nega_or_posi ],
      "width": width + "px"
    } ).css( {
      "display": "block",
      "position": "absolute",
      "top": "0",
      "left": "0"
    } ) );

    $div.append( $( "<div></div>" )
    .css( {
      "position": "absolute",
      "top": "35px",
      "left": "0",
      "width": width + "px",
      "color": "white",
      "text-align": "center",
      "font-family": "ヒラギノ角ゴ StdN"
    } ).text( comment ) );

    $( "#effect-area" ).append( $div );

    $div.delay( index * 50 )
        .fadeIn( 1000 )
        .delay( 800 )
        .fadeOut( 2000 );
  }
});


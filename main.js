$(function(){
  var showed = false;
  var entries = {};
  var entries_ids = [];
  var wave_colors = d3.scale.linear().domain([-1, 0, 1]).range(["#178BCA", "purple", "#FFDDDD"]);
  var wave_id = 0;

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
          setWave( null, entries[ json.pages[ 0 ].entry_id ] );
        },
        error: function( err ){
          console.log( err );
        }
      } );
    }

    showed = true;
  } );

  function setWave( wave_param, entry ){
    var d3_svg = d3.select( entry.dom )
        .append( "svg" )
        .attr( "id", "wave-" + wave_id )
        .style( {
          "position": "absolute",
          "top": "0",
          "left": "0",
          "width": entry.svg_width,
          "height": entry.svg_height,
          "z-index": "0",
          "events-pointer": "none"
        } );

    var config = liquidFillGaugeDefaultSettings();
    config.waveColor = wave_colors( 0.5 );
    var wave = loadLiquidFillGauge("wave-" + wave_id, 50, config, entry.users_num);

    $( entry.dom ).find( ".users strong" )
      .css( "visibility", "hidden" );

    wave_id ++;
  }
});


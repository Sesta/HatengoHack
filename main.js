$(function(){
  var showed = false;
  var entries = {};

  $( ".entry-unit[data-eid]")
    .each( function(){
      var $users = $( this ).find( ".users" )
        .css( {
          "position": "relative",
          "z-index": "1"
        } );

      entries[ $( this ).attr( "data-eid" ) ] = {
        id: $( this ).attr( "data-eid" ),
        url: $( this ).find( ".entry-contents a" ).attr( "href" ),
        svg_height: $users.height(),
        svg_width: $users.width(),
        dom: this
      };
    } );

  chrome.runtime.onMessage.addListener( function( request ) {
    if( showed ) return ;
    if( request.type != "batloika_clicked" ) return ;

    $.ajax( {
      type: "GET",
      url: "http://210.140.71.3:8080/hello",
      dataType: "json",
      success: function( json ){
        console.log( json );
      }
    } );

    for( entry_id in entries ){
      setWave( null, entries[ entry_id ] );
    }
  } );



  function setWave( wave_param, entry ){
    var d3_svg = d3.select( entry.dom )
        .append( "svg" )
        .attr( "id", "wave-" + entry.id )
        .style( {
          "position": "absolute",
          "top": "0",
          "left": "0",
          "width": entry.svg_width,
          "height": entry.svg_height,
          "z-index": "0"
        } );

    var wave = loadLiquidFillGauge("wave-" + entry.id, 50);
    var config1 = liquidFillGaugeDefaultSettings();

    showed = true;
  }
});


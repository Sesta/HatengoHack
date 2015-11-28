$(function(){
  var showed = false;

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

    setWave( null );
  } );



  function setWave( wave_param ){
    var $header = $( ".entry-unit .users" )
      .css( {
        "position": "relative",
        "z-index": "1"
      } );

    var svg_width = $header.width();
    var svg_height = $header.height();

    var d3_svg = d3.select( ".entry-unit" )
        .append( "svg" )
        .attr( "id", "wave" )
        .style( {
          "position": "absolute",
          "top": "0",
          "left": "0",
          "width": svg_width,
          "height": svg_height,
          "z-index": "0"
        } );

    var wave = loadLiquidFillGauge("wave", 50);
    var config1 = liquidFillGaugeDefaultSettings();

    showed = true;
  }
});


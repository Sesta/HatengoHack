$(function(){
  $.ajax( {
    type: "GET",
    url: "http://210.140.71.3:8080/hello",
    dataType: "json",
    success: function( json ){
      console.log( json );
    }
  } );

  var d3_svg = d3.select( "body" )
        .append( "svg" )
        .attr( "id", "wave" )
        .style( {
          "position": "absolute",
          "top": "0",
          "left": "0",
          "z-index": "0"
        } );

  var wave = loadLiquidFillGauge("wave", 55);
  var config1 = liquidFillGaugeDefaultSettings();
});

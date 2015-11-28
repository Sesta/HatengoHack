$(function(){
  var showed = false;
  var entries = {};
  var wave_colors = d3.scale.linear().domain([-1, 0, 1]).range(["#178BCA", "purple", "#FFDDDD"]);

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
    } );

  chrome.runtime.onMessage.addListener( function( request ) {
    if( showed ) return ;
    if( request.type != "batloika_clicked" ) return ;

    $.ajax( {
      type: "POST",
      url: "http://210.140.71.3:8080/negaposi",
      dataType: "json",
      data : {
        "urls": [
          "http://techlife.cookpad.com/entry/2015/11/27/194316",
          "http://anond.hatelabo.jp/20151127231648"
         ]
      },
      success: function( json ){
        console.log( json );
      }
    } );

    for( entry_id in entries ){
      setWave( null, entries[ entry_id ] );
    }

    showed = true;
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

    var config = liquidFillGaugeDefaultSettings();
    config.waveColor = wave_colors( 0.5 );
    var wave = loadLiquidFillGauge("wave-" + entry.id, 50, config, entry.users_num);

    $( entry.dom ).find( ".users strong" ).remove();
  }
});


$(function(){
  $.ajax( {
    type: "GET",
    url: "http://210.140.71.3:8080/hello",
    dataType: "json",
    success: function( json ){
      console.log( json );
      alert( json.sample.message );
    }
  } )
});

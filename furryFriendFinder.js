// flow of search input of search or selector selects breed and initiates AJAX call to THE DOG API to pull breed

var breeds; // declares local variable and sets it to undefined

//sets up search bar input and calls searchBreeds function, which calls getDogByBreed function same as the selector
$('#breed_search').on('input', function(e) {
  var search_str = $(this).val();
  searchBreeds(search_str);
});

function searchBreeds(search_str) {
    var string_length = search_str.length // get the length of the search string so we know how many characters of the breed name to compare it to
    search_str = search_str.toLowerCase(); // ensure search string and breed name are same case otherwise they won't match
    for (var i = 0; i < breeds.length; i++) // loop through all the breeds in order
    {
      var breed_name_snippet = breeds[i].name.substr(0, string_length).toLowerCase(); // get the first few cahracters of the name
      if (breed_name_snippet == search_str) {
       console.log(breeds[i]);
        getDogImageByBreed(breeds[i].id) // show the breed image
        //getDogDataByBreed(breeds[i]) 
        displayBreedData(breeds[i]);
        return; // return the function so we don't keep searching
      }
    }
}

//set up the selector control 

var $breed_select = $(`select.breed_select`); 
$breed_select.change(function(){
    var dataId = $(this).children(":selected").attr("id")
    var imageId = $(this).children(":selected").attr("id");
    console.log(dataId);
    console.log(imageId);
    getDogImageByBreed(imageId);
    getDogDataByBreed(dataId); 
    //displayBreedData(dataId);
});

//put the breeds in the Select Control 
function populateBreedsSelect(breeds) {
    $breed_select.empty().append(function() {
      var output = '';
      $.each(breeds, function(key, value) {
        output += '<option id="' + value.id + '">' + value.name + '</option>';
      });
      return output;
    });
  }

  // load all breeds to from the API and sets breeds variable equal to the data of dogs 
function getBreeds() {
    $.get('https://api.thedogapi.com/v1/breeds', (data) => {
        console.log(data)
        populateBreedsSelect(data)
        breeds = data
  });
}

//
// Selecting a breed triggered when select control changes 
//
// pulls dog image when breed is selected and displays it on page
function getDogImageByBreed(breed_imageId) {
// search for images that contain the breed (breed_id==) and attach to the breed object
 $.get('https://api.thedogapi.com/v1/images/search?include_breed=1&breed_id=' + breed_imageId, function(data) {
    if (data.length == 0) {
        // if no images returned 
        clearBreed(); 
        $("#breed_data_table").append("<tr><td>Sorry, no Image for that breed</td></tr?");
    } else {
        //display the breed image and data
        //console.log(data[0]); 
        displayBreedImage(data[0])
        }
    });
}

    // clear image and table within getDogByBreed funciton 
    function clearBreed(){
        $('#breed_image').attr('src',""); 
        $('#breed_data_table').remove(); 
    }

    // display the breed image 
    function displayBreedImage(image){
       // console.log(image); 
        $('#breed_image').attr('src',image.url); 
               
    }
// get the dog data by breed to be able to populate when using the selector 
function getDogDataByBreed(data) {
    $('#breed_data_table').empty();
    console.log(data); 
    console.log(breeds); // iterrate through breeds and match ID and return that breed to solve the selector issue. 
            
}
     

    // display the breed data
    function displayBreedData(data){ 
        $('#breed_data_table').empty(); 
        var breed_data = data;
        console.log(breed_data);
        $.each(breed_data, function(key, value) {
            if(key == 'weight') value = value.imperial +'lbs';
            if(key == 'height') value = value.imperial + 'inches';
            delete data['reference_image_id']; 
            delete data['image']; 
            //add row to the table
            $("#breed_data_table").append("<tr><td>" + key + "</td><td>" + value + "</td></tr>"); 
        });
    }


    getBreeds(); 

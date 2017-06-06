const photoSection = document.getElementById("photos-section");
const photosList = document.getElementById("photos-list");
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const flickrAPI = 'abf9c4fed3b7e0d8ff275582a9ae1b4d';
const closeButton = document.getElementById("close-button");
const exifSection = document.getElementById('exif-section');
let bigImage;
let exifDescription;


function takeInputValue(event){
    var searchInputValue = searchInput.value;

    event.preventDefault();
    event.stopImmediatePropagation();    
    deleteListOfPhoto();

    //remove "no-result" info
    document.getElementById("no-result-info").classList.remove("true");

    if(searchInputValue==""){
        if(exifSection.classList.contains("remove-transform")){hiddenExifBox();}
        alert("wpisz szukane słowo");
    }else{getJson(searchInputValue);}
}

function getJson(searchInputValue){
    const sort = "relevance";
    $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=' + flickrAPI + 
    '&text='+ searchInputValue + '&sort=' + sort + '&format=json&nojsoncallback=1', 
    function(data) {
        getPhotosData(data);
});
}

function getPhotosData(data){
    let dataPhoto = data.photos.photo;
    let photosDataArray = [];
    let photoObject={};

    if(dataPhoto.length==0){
        document.getElementById("no-result-info").classList.add("true");
    }

    for(let i=0; i<dataPhoto.length;i++){
        photoObject[i] = {};
        photoObject[i].url = `https://farm${dataPhoto[i].farm}.staticflickr.com/${dataPhoto[i].server}/${dataPhoto[i].id}_${dataPhoto[i].secret}_t.jpg`;
        photoObject[i].id = dataPhoto[i].id;
        photosDataArray.push(photoObject[i]);
    }

    displayPhotos(photosDataArray,dataPhoto);

}

function displayPhotos(photosDataArray){
    for(let i=0;i<photosDataArray.length;i++){

        const photoItem = document.createElement('li');
        const image = document.createElement('img');
        image.src = photosDataArray[i].url;
        image.dataset.id = photosDataArray[i].id;
        photoItem.appendChild(image);
        photosList.appendChild(photoItem);
    }

    const imageItem = document.querySelectorAll("img");
    Array.from(imageItem);
    imageItem.forEach(picture => picture.addEventListener("click",getMoreInformationExif));
}

function getMoreInformationExif(){
    var chosenImgId = this.dataset.id;

     $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.getExif&api_key=' +flickrAPI+ '&photo_id=' +chosenImgId +'&format=json&nojsoncallback=1', 
            function(data) {
                if(bigImage && exifDescription){
                bigImage.remove();
                exifDescription.remove();
            }
            
            if(data.stat=="ok"){
                getExifDetailsWithPhoto(data);}
            
            if(data.stat=="fail"){
                getPhotoWithoutExif(chosenImgId);}
            }
     )};


function getPhotoWithoutExif(chosenImgId){
         $.getJSON('https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=' +flickrAPI+ '&photo_id=' +chosenImgId +'&format=json&nojsoncallback=1', 
            function(info) {
                srcOfBigImage = `https://farm${info.photo.farm}.staticflickr.com/${info.photo.server}/${info.photo.id}_${info.photo.secret}_z.jpg`;
                arrayOfExifDetails=["autor nie udostępnił danych"];

                const exifData = arrayOfExifDetails;
                const newBigPhoto = srcOfBigImage;

                displayExifBigPhoto(exifData,newBigPhoto);
            });}

function getExifDetailsWithPhoto(data){
//array for exif details      
        srcOfBigImage = `https://farm${data.photo.farm}.staticflickr.com/${data.photo.server}/${data.photo.id}_${data.photo.secret}_z.jpg`;
        if(data.photo.exif.length>0){
            arrayOfExifDetails=[];
            for(i=0; i<data.photo.exif.length;i++){
                arrayOfExifDetails.push(`${data.photo.exif[i].label}: ${data.photo.exif[i].raw._content}`);}
        }else{
            
            arrayOfExifDetails = ['brak danych'];
    }
    var exifData = arrayOfExifDetails;
    var newBigPhoto = srcOfBigImage;

//create content with Exif and big Photo

   displayExifBigPhoto(exifData,newBigPhoto);
}

function displayExifBigPhoto(exifData,newBigPhoto){
     bigImage = document.createElement('img');
    bigImage.src = newBigPhoto;
    exifDescription = document.createElement('div');
    exifDescription.classList.add("exif-description");

    const exifList = `
    <ul>
      ${exifData.map(exif => `
        <li>
          ${exif}
        </li>`).join('')}
    </ul>
  `;

    exifDescription.innerHTML = exifList;
    exifSection.appendChild(bigImage);
    exifSection.appendChild(exifDescription);

   
    exifSection.classList.remove("transform");
    exifSection.classList.add("remove-transform");
}

function hiddenExifBox(){
    exifSection.classList.add("transform");
    exifSection.classList.remove("remove-transform");

    bigImage.remove();
    exifDescription.remove();
}

function deleteListOfPhoto(){
    if(photosList.hasChildNodes){
        $(photosList).empty();
    }
}

searchButton.addEventListener("click",takeInputValue);
closeButton.addEventListener("click",hiddenExifBox);
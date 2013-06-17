http://responsiveimages.org/

<picture width="500"  height="500">     
  <source  media="(min-width: 45em)" src="large.jpg">
  <source  media="(min-width: 18em)" src="med.jpg">
  <source  src="small.jpg">
  <img  src="small.jpg" alt="">
  <p>Accessible  text</p>
</picture>



<picture id="pictureElement">
   <source media="(min-width: 45em)" srcset="large-1.jpg 1x, large-2.jpg 2x">
   <source media="(min-width: 18em)" srcset="med-1.jpg 1x, med-2.jpg 2x">

   <!-- assume media all -->
   <source srcset="small-1.jpg 1x, small-2.jpg 2x">

   <!-- the following are ignored -->
   <source media=" is the message " srcset="">
      
</picture>

//Becomes the rough CSS equivalent of (a virtual stylesheet for the document?):
//assume #pictureElement is magically scoped to the corresponding element.

@media all{
   #pictureElement{
      background-image: image-set(small-1.jpg 1x, small-2.jpg 2x);
   }
}

@media all and (min-width: 45em){
   #pictureElement{
      background-image: image-set(large-1.jpg 1x, large-2.jpg 2x);
   }
}

@media all and (min-width: 18em){
   #pictureElement{
      background-image: image-set(med-1.jpg 1x, med-2.jpg 2x);
   }
}
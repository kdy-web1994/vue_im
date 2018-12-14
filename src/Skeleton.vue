<template>
  <div class="skeleton_page">
    
<div class="skeleton_item">
    
</div>

<div class="skeleton_item">
    
</div>
<div class="skeleton_item">
    
</div>
<div class="skeleton_item">
    
</div>
<div class="skeleton_item">
    
</div>


  </div>
</template>

<style>

.skeleton_page {
  min-height: 100vh;
  background: #FFF;
  padding: 10px;
  box-sizing: border-box;
}

.skeleton_item{
  background: rgb(194, 207, 214);
  width: 2rem;
  height: 1rem;
  animation: skeleton-stretch .5s linear infinite alternate;
}


 
@keyframes skeleton-stretch {
  from {
    transform: scalex(1);
  }
  to {
    transform: scalex(.3);
  }
}

</style>

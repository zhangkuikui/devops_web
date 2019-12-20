<template>

      <div id="index">
        <h1>首页</h1>

        <div class="alert">
          <b>Hello, world!</b><br>
          <span>欢迎来到运维部。</span>
        </div>
      </div>



</template>

<script>

export default {
  components:{

  }


}
</script>

<style scoped>
#index{
    color: #555555;
    height: 100%;
}
.alert{
    background-color: #fff;
    height: 500px;
    padding-left:30px
}
.alert>b{
    font-size: 100px;
    font-weight: 300;
}
.alert>span{
    font-weight: 100;
}

</style>

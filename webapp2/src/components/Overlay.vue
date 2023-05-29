<template>
  <div>
    <!-- DBアクセス時に表示するオーバーレイ -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64">
      </v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
export default {
  props: {
    overlay: Boolean
  },
  data () {
    return {}
  }
}
</script>

<style>
#overlay{
  /* 要素を重ねた時の順番 */
  z-index:1;
  /* 画面全体を覆う設定 */
  position:fixed;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background-color:rgba(0,0,0,0.5);
  /* 画面の中央に要素を表示させる設定 */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

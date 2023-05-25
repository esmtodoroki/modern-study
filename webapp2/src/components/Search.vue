<template>
  <div>
    <v-row class="mx-3">
    書籍を検索
    </v-row>
    <v-row>
      <v-col cols="3" class="pt-1 pb-0">
        <v-text-field
        v-model="searchTitle"
        solo
        clearable
        label="書籍名"
        variant="outlined"
        width="400">
        </v-text-field>
      </v-col>
      <v-col cols="2" class="pt-1 pb-0">
        <v-select
          solo
          v-model="searchGenre"
          :items="formGenreList"
          label="ジャンル"
          item-text="genreName"
          item-value="genreId"
          width="100"
          >
        </v-select>
      </v-col>
      <v-col cols="4" class="pt-1 pb-0">
        <v-btn
          color="light-blue lighten-1"
          class="mt-2 white--text"
          @click="searchBook">
          <v-icon left>mdi-folder-search</v-icon>検索
        </v-btn>
        <v-btn
          color="blue darken-3"
          class="mt-2 ml-2 white--text"
          @click="searchClear">
          <v-icon left>mdi-backspace</v-icon>検索条件クリア
        </v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: {
    formGenreList: Array
  },
  data () {
    return {
      searchTitle: '',
      searchGenre: ''
    }
  },
  created () {},
  computed: {},
  methods: {
    searchBook () {
      this.$emit('searchBook',
        this.searchTitle,
        this.searchGenre)
    },
    searchClear () {
      this.searchTitle = ''
      this.searchGenre = ''
      this.$emit('searchClear')
    }
  }
}
</script>

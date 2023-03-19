<template>
  <div>
    <v-row class="mx-3">
    書籍を検索
    </v-row>
    <v-row>
      <v-col cols="3" class="pt-1 pb-0">
        <v-text-field solo clearable label="書籍名" variant="outlined" width="400"></v-text-field>
      </v-col>
      <v-col cols="2" class="pt-1 pb-0">
        <v-select
          solo
          v-bind:items="genreList"
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
    <v-row>
      <v-col class="pt-0">
        <v-btn
          color="teal accent-2"
          @click="insertNewItem">
          <v-icon left>mdi-pencil-plus</v-icon>書籍を登録
        </v-btn>
      </v-col>
    </v-row>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="bookId"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn
          small
          color="orange lighten-1"
          class="mx-1 white--text"
          @click="editItem(item)">
          <v-icon left>mdi-pencil</v-icon>編集
        </v-btn>
        <v-btn
          small
          color="red accent-3"
          class="mx-1 white--text"
          @click="deleteItem(item)">
          <v-icon left>mdi-delete</v-icon>削除
        </v-btn>
      </template>
    </v-data-table>
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64">
      </v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
export default {
  data () {
    return {
      genreList: [ ],
      headers: [
        { text: 'タイトル', value: 'title', width: '50%' },
        { text: 'ジャンル', value: 'genreName', width: '14%' },
        { text: '購入日', value: 'purchaseDate', width: '10%' },
        { text: '購入者', value: 'purchaseName', width: '10%' },
        { text: '操作', value: 'actions', width: '16%', sortable: false }
      ],
      items: [ ],
      overlay: false
    }
  },
  async created () {
    this.overlay = true
    await this.initialLoad()
    this.overlay = false
  },
  computed: {},
  methods: {
    // ページロード時の読み込み処理
    async initialLoad () {
      const initialGet = await Promise.all([
        this.readBookTableAll(),
        this.readGenreTable()
      ]).catch((e) => {
        this.notifyFailure()
      })
      this.items = initialGet[0]
      this.genreList = initialGet[1]
    },
    // GASを使用しジャンルテーブルを読み込み、Promise返却
    readGenreTable () {
      return new Promise((resolve, reject) => {
        google.script.run // eslint-disable-line no-undef
          .withSuccessHandler((result) => resolve(result))
          .withFailureHandler((error) => reject(error))
          .readGenreTable()
      })
    },
    // GASを使用し書籍テーブルを読み込み、Promise返却
    readBookTableAll () {
      return new Promise((resolve, reject) => {
        google.script.run // eslint-disable-line no-undef
          .withSuccessHandler((result) => resolve(result))
          .withFailureHandler((error) => reject(error))
          .readBookTableAll()
      })
    },
    // DBアクセス異常通知
    notifyFailure () {
      alert('DBにアクセス出来ませんでした。DBの状態を確認してください！')
    }
  }
}
</script>

<style>
.v-data-table th {
    background: #90CAF9;
}
</style>

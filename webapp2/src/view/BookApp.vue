<template>
  <div>
    書籍を検索
    <v-row>
      <v-col cols="3">
        <v-text-field solo clearable label="書籍名" variant="outlined" width="400"></v-text-field>
      </v-col>
      <v-col cols="2">
        <v-select solo v-bind:items="genre" label="ジャンル" width="100"></v-select>
      </v-col>
      <v-col cols="2" class="d-flex align-left">
        <v-btn color="light-blue lighten-1" class="ma-2 white--text" @click="searchBook"><v-icon left>mdi-folder-search</v-icon>検索</v-btn>
        <v-btn color="blue darken-3" class="ma-2 white--text" @click="searchClear"><v-icon left>mdi-backspace</v-icon>検索条件クリア</v-btn>
      </v-col>
    </v-row>
    <p>
    <v-btn color="teal accent-2" @click="registNewItem"><v-icon left>mdi-pencil-plus</v-icon>書籍を登録</v-btn>
    <p>
    <v-data-table
      :headers="headers"
      :items="items"
      sort-by="bookId"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn small color="orange lighten-1" class="ma-2 white--text" @click="editItem(item)"><v-icon left>mdi-pencil</v-icon>編集</v-btn>
        <v-btn small color="red accent-3" class="ma-2 white--text" @click="deleteItem(item)"><v-icon left>mdi-delete</v-icon>削除</v-btn>
      </template>
    </v-data-table>
  </div>
</template>

<script>
export default {
  data () {
    return {
      genre: [ '雑誌', '小説', '実用書', 'ノンフィクション' ], // 仮に固定値設定
      headers: [
        { text: 'タイトル', value: 'title', width: '50%' },
        { text: 'ジャンル', value: 'genre', width: '14%' },
        { text: '購入日', value: 'date', width: '10%' },
        { text: '購入者', value: 'buyer', width: '10%' },
        { text: '操作', value: 'actions', width: '16%', sortable: false }
      ],
      items: [
        { bookId: 1, title: '書籍Ａ', genre: 'ジャンルＣ', date: '2022/11/23', buyer: '購入者Ｅ' }, // 仮の値
        { bookId: 2, title: '書籍Ｂ', genre: 'ジャンルＤ', date: '2022/05/10', buyer: '購入者Ｆ' } // 仮の値
      ]
    }
  },
  created () {},
  computed: {},
  methods: {}
}
</script>

<style>
.v-data-table th {
    background: #90CAF9;
}
</style>

<template>
  <div>
    <!-- 登録されている書籍情報を表示するリスト -->
    <v-data-table
      :headers="headers"
      :items="items"
      @click:row="showReview"
      sort-by="bookId"
    >
      <template v-slot:item.actions="{ item }">
        <v-btn
          small
          color="orange lighten-1"
          class="mx-1 white--text"
          @click.stop="openEditForm(item)">
          <v-icon left>mdi-pencil</v-icon>編集
        </v-btn>
        <v-btn
          small
          color="red accent-3"
          class="mx-1 white--text"
          @click.stop="openDeleteDialog(item)">
          <v-icon left>mdi-delete</v-icon>削除
        </v-btn>
      </template>
    </v-data-table>
    <!-- 書籍削除時に表示する確認ダイアログ -->
    <v-dialog v-model="dialogDelete" max-width="25%">
      <v-card>
        <v-card-title>{{ dialogTitle }}</v-card-title>
        <v-card-actions>
          <v-btn
            color="red accent-3"
            class="mx-auto white--text"
            @click="deleteItemConfirm"
          >削除
          </v-btn>
          <v-btn
            color="secondary"
            class="mx-auto"
            @click="closeDelete"
          >取消
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <!-- 書籍レビューを表示するダイアログ -->
    <v-dialog
      v-model="dialogReview"
      persistent
      max-width="35%">
      <v-card>
        <v-card-title>{{ reviewTitle }}</v-card-title>
        <v-card-text>
          <v-row>
            <v-textarea
              v-model="selectedReview"
              solo
              dense
              readonly
            ></v-textarea>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn
            color="secondary"
            class="mx-auto"
            @click="closeReview"
          >閉じる
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
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
    items: Array
  },
  data () {
    return {
      headers: [
        { text: 'タイトル', value: 'title', width: '50%' },
        { text: 'ジャンル', value: 'genreName', width: '14%' },
        { text: '購入日', value: 'purchaseDate', width: '10%' },
        { text: '購入者', value: 'purchaseName', width: '10%' },
        { text: '操作', value: 'actions', width: '16%', sortable: false }
      ],
      overlay: false,
      dialogDelete: false,
      dialogReview: false,
      selectedBookId: '',
      selectedTitle: '',
      selectedReview: ''
    }
  },
  created () {},
  computed: {
    dialogTitle () {
      return `【${this.selectedTitle}】を削除しますか？`
    },
    reviewTitle () {
      return `【${this.selectedTitle}】のレビュー`
    }
  },
  methods: {
    // 書籍編集フォーム表示
    openEditForm (item) {
      this.$emit('openEditForm',
        item.bookId,
        item.title,
        item.genreId,
        item.purchaseDate,
        item.purchaseName,
        item.review)
    },
    // 書籍削除ダイアログ表示
    openDeleteDialog (item) {
      this.selectedBookId = item.bookId
      this.selectedTitle = item.title
      this.dialogDelete = true
    },
    // 書籍削除決定
    async deleteItemConfirm () {
      this.closeDelete()
      this.overlay = true
      try {
        await this.deleteItem() // 書籍削除
        this.$emit('reloadItem') // 書籍一覧更新
      } catch (e) {
        this.$emit('notifyFailure')
      }
      this.overlay = false
    },
    // GASを使用し書籍テーブルから書籍レコード削除、Promise返却
    deleteItem () {
      return new Promise((resolve, reject) => {
        google.script.run // eslint-disable-line no-undef
          .withSuccessHandler((result) => resolve(result))
          .withFailureHandler((error) => reject(error))
          .deleteBook(this.selectedBookId)
      })
    },
    // 削除ダイアログクローズ
    closeDelete () {
      this.dialogDelete = false
    },
    // 書籍レビューダイアログオープン
    showReview (item) {
      this.selectedTitle = item.title
      this.selectedReview = item.review
      this.dialogReview = true
    },
    // 書籍レビューダイアログクローズ
    closeReview () {
      this.dialogReview = false
      this.selectedTitle = ''
      this.selectedReview = ''
    }
  }
}
</script>

<style>
.v-data-table th {
    background: #90CAF9;
}
</style>

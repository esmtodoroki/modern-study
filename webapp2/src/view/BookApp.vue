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
          v-bind:items="searchGenreList"
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
<!-- 疎通確認用ボタン（後で消す） -->
        <v-btn
          color="blue-grey darken-3"
          class="mt-2 ml-2 white--text"
          @click="showReview">
          <v-icon left>mdi-book-open-variant</v-icon>（仮）
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="pt-0">
        <v-btn
          color="teal accent-2"
          @click="openForm">
          <v-icon left>mdi-pencil-plus</v-icon>書籍を登録
        </v-btn>
      </v-col>
    </v-row>
    <!-- 登録されている書籍情報を表示するリスト -->
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
          @click="openEditForm(item)">
          <v-icon left>mdi-pencil</v-icon>編集
        </v-btn>
        <v-btn
          small
          color="red accent-3"
          class="mx-1 white--text"
          @click="openDeleteDialog(item)">
          <v-icon left>mdi-delete</v-icon>削除
        </v-btn>
      </template>
    </v-data-table>
    <!-- DBアクセス時に表示するオーバーレイ -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64">
      </v-progress-circular>
    </v-overlay>
    <!-- 書籍登録／編集時に表示する入力フォーム -->
    <div id="overlay" v-show="showForm">
      <div id="formWindow">
        <v-card>
          <v-card-title>
            書籍登録／編集
          </v-card-title>
          <v-card-text>
            <v-form ref="form">
              <v-row>
                <v-col class="py-0">
                  <v-text-field
                    v-model="formTitle"
                    label="タイトル"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0">
                  <v-select
                    v-model="selectedFormGenreList"
                    :items="formGenreList"
                    label="ジャンル"
                    item-text="genreName"
                    item-value="genreId"
                    required
                  ></v-select>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0">
                  <v-menu
                    ref="menu"
                    v-model="pickerMenu"
                    :close-on-content-click="false"
                    :return-value.sync="pickerDate"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="pickerDate"
                        label="購入日"
                        prepend-icon="mdi-calendar-cursor"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="pickerDate"
                      no-title
                      scrollable
                    >
                      <v-spacer></v-spacer>
                      <v-btn
                        class="mr-2"
                        color="primary"
                        @click="$refs.menu.save(pickerDate)"
                      >
                        決定
                      </v-btn>
                      <v-btn
                        class="mr-2"
                        color="secondary"
                        @click="pickerMenu = false"
                      >
                        取消
                      </v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0">
                  <v-text-field
                    v-model="formPurchaseName"
                    label="購入者"
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0">
                  <v-textarea
                    v-model="formReview"
                    filled
                    label="レビュー"
                    auto-grow
                    clearable
                  ></v-textarea>
                </v-col>
              </v-row>
              <v-row>
                <v-col class="py-0" align="center">
                  <v-btn
                    class="mr-4"
                    color="primary"
                    @click="handlerInsertOrUpdate"
                  >
                    登録
                  </v-btn>
                  <v-btn
                    color="secondary"
                    @click="closeForm"
                  >
                    取消
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </div>
    </div>
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
              v-model="formReview"
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
  </div>
</template>

<script>
export default {
  data () {
    return {
      searchGenreList: [],
      headers: [
        { text: 'タイトル', value: 'title', width: '50%' },
        { text: 'ジャンル', value: 'genreName', width: '14%' },
        { text: '購入日', value: 'purchaseDate', width: '10%' },
        { text: '購入者', value: 'purchaseName', width: '10%' },
        { text: '操作', value: 'actions', width: '16%', sortable: false }
      ],
      items: [],
      formTitle: '',
      formGenreList: [],
      selectedFormGenreList: '',
      pickerDate: new Date().toISOString().substr(0, 10),
      pickerMenu: false,
      formPurchaseName: '',
      formReview: '',
      selectedBookId: '',
      selectedTitle: '',
      overlay: false,
      showForm: false,
      dialogDelete: false,
      dialogReview: false
    }
  },
  async created () {
    this.overlay = true
    await this.initialLoad()
    this.overlay = false
  },
  computed: {
    dialogTitle () {
      return `【${this.selectedTitle}】を削除しますか？`
    },
    reviewTitle () {
      return `【${this.formTitle}】のレビュー`
    }
  },
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
      this.searchGenreList = initialGet[1]
      this.formGenreList = this.searchGenreList
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
    // GASを使用し書籍テーブルへ新規登録、Promise返却
    insertNewItem () {
      return new Promise((resolve, reject) => {
        google.script.run // eslint-disable-line no-undef
          .withSuccessHandler((result) => resolve(result))
          .withFailureHandler((error) => reject(error))
          .insertNewBook(
            this.formTitle,
            this.selectedFormGenreList,
            this.pickerDate,
            this.formPurchaseName,
            this.formReview
          )
      })
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
    // GASを使用し書籍テーブルを更新、Promise返却
    updateItem () {
      return new Promise((resolve, reject) => {
        google.script.run // eslint-disable-line no-undef
          .withSuccessHandler((result) => resolve(result))
          .withFailureHandler((error) => reject(error))
          .updateBook(
            this.selectedBookId,
            this.formTitle,
            this.selectedFormGenreList,
            this.pickerDate,
            this.formPurchaseName,
            this.formReview
          )
      })
    },
    // 書籍新規登録フォーム表示
    openForm () {
      this.selectedBookId = 0
      this.showForm = true
    },
    // 書籍新規登録サブミット
    async submitInsertNewItem () {
      this.overlay = true
      try {
        await this.insertNewItem() // 書籍登録
        this.items = await this.readBookTableAll() // 書籍一覧更新
      } catch (e) {
        this.notifyFailure()
      }
      this.overlay = false
      this.closeForm()
    },
    // 入力フォームクローズ
    closeForm () {
      this.$refs.form.reset()
      this.showForm = false
    },
    // 書籍削除ダイアログ表示
    openDeleteDialog (item) {
      this.dialogDelete = true
      this.selectedBookId = item.bookId
      this.selectedTitle = item.title
    },
    // 書籍削除決定
    async deleteItemConfirm () {
      this.closeDelete()
      this.overlay = true
      try {
        await this.deleteItem() // 書籍削除
        this.items = await this.readBookTableAll() // 書籍一覧更新
      } catch (e) {
        this.notifyFailure()
      }
      this.overlay = false
    },
    // 削除ダイアログクローズ
    closeDelete () {
      this.dialogDelete = false
    },
    // 書籍編集フォーム表示
    openEditForm (item) {
      this.selectedBookId = item.bookId
      this.formTitle = item.title
      this.selectedFormGenreList = item.genreId
      this.pickerDate = item.purchaseDate
      this.formPurchaseName = item.purchaseName
      this.formReview = item.review
      this.showForm = true
    },
    // 書籍情報更新サブミット
    async submitUpdateItem () {
      this.overlay = true
      try {
        await this.updateItem() // 書籍情報更新
        this.items = await this.readBookTableAll() // 書籍一覧更新
      } catch (e) {
        this.notifyFailure()
      }
      this.overlay = false
      this.closeForm()
    },
    // 書籍新規登録と既存書籍更新の処理を振り分けるハンドラー
    handlerInsertOrUpdate () {
      if (this.selectedBookId === 0) {
        this.submitInsertNewItem() // 新規登録
      } else {
        this.submitUpdateItem() // 既存更新
      }
    },
    // 書籍レビューダイアログオープン
    showReview (item) {
      // 疎通確認用に仮の値をセット
      this.formTitle = '書籍のタイトル'
      this.formReview = '書籍のレビューをここに表示する'
      this.dialogReview = true
    },
    // 書籍レビューダイアログクローズ
    closeReview () {
      this.dialogReview = false
    },
    // DBアクセス異常通知
    notifyFailure () {
      alert('DBにアクセス出来ませんでした。DBの状態を確認してください！')
      this.overlay = false
    }
  }
}
</script>

<style>
.v-data-table th {
    background: #90CAF9;
}
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
#formWindow{
  z-index:2;
  width:30%;
  padding: 1em;
  background:#90CAF9;
}
</style>

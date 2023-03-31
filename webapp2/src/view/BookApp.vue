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
                    v-bind:items="formGenreList"
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
                    @click="submitInsertNewItem"
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
      pickerDate: new Date().toISOString().substr(0, 10),
      pickerMenu: false,
      formPurchaseName: '',
      formReview: '',
      overlay: false,
      showForm: false
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
    // ※疎通確認用に固定値セット
    insertNewItem () {
      return new Promise((resolve, reject) => {
        google.script.run // eslint-disable-line no-undef
          .withSuccessHandler((result) => resolve(result))
          .withFailureHandler((error) => reject(error))
          .insertNewBook('書籍名', '12', this.pickerDate, '某', 'まあまあ')
      })
    },
    // 書籍新規登録フォーム表示
    openForm () {
      this.showForm = true
    },
    // 書籍新規登録サブミット
    async submitInsertNewItem () {
      this.overlay = true
      try {
        await this.insertNewItem() // 書籍登録
      } catch (e) {
        this.notifyFailure()
      }
      try {
        await this.readBookTableAll() // 書籍一覧リロード（現状動作せず）
      } catch (e) {
        this.notifyFailure()
      }
      this.overlay = false
      this.closeForm()
    },
    closeForm () {
      this.$refs.form.reset()
      this.showForm = false
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

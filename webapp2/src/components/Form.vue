<template>
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
                  :rules="[required]"
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
                  @click="checkInput"
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
    <!-- DBアクセス時に表示するオーバーレイ -->
    <Overlay :overlay="overlay" />
  </div>
</template>

<script>
import Overlay from '@/components/Overlay.vue'
export default {
  components: {
    Overlay
  },
  props: {
    showForm: Boolean,
    formGenreList: Array,
    isNewBook: Boolean,
    selectedBookId: Number,
    selectedTitle: String,
    selectedGenreId: String,
    selectedPurchaseDate: String,
    selectedPurchaseName: String,
    selectedReview: String
  },
  data () {
    return {
      formTitle: '',
      selectedFormGenreList: '',
      pickerMenu: false,
      pickerDate: '',
      formPurchaseName: '',
      formReview: '',
      required: value => !!value || '入力必須項目です',
      overlay: false
    }
  },
  created () {},
  computed: {},
  watch: {
    selectedBookId () {
      this.formTitle = this.selectedTitle
      this.selectedFormGenreList = this.selectedGenreId
      this.pickerDate = this.selectedPurchaseDate
      this.formPurchaseName = this.selectedPurchaseName
      this.formReview = this.selectedReview
    }
  },
  methods: {
    // フォームの入力チェック
    checkInput () {
      if (this.$refs.form.validate()) {
        this.handlerInsertOrUpdate()
      }
    },
    // 新規登録・既存書籍更新の振り分けハンドラー
    handlerInsertOrUpdate () {
      if (this.isNewBook) {
        this.submitInsertNewItem() // 新規登録
      } else {
        this.submitUpdateItem() // 既存更新
      }
    },
    // 書籍新規登録サブミット
    async submitInsertNewItem () {
      this.overlay = true
      try {
        await this.insertNewItem() // 書籍登録
        this.$emit('reloadItem') // 書籍一覧更新
      } catch (e) {
        this.$emit('notifyFailure')
      }
      this.overlay = false
      this.closeForm()
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
    // 書籍情報更新サブミット
    async submitUpdateItem () {
      this.overlay = true
      try {
        await this.updateItem() // 書籍情報更新
        this.$emit('reloadItem') // 書籍一覧更新
      } catch (e) {
        this.$emit('notifyFailure')
      }
      this.overlay = false
      this.closeForm()
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
    // 入力フォームクローズ
    closeForm () {
      this.$refs.form.resetValidation()
      this.$emit('closeForm')
    }
  }
}
</script>

<style>
#formWindow{
  z-index:2;
  width:30%;
  padding: 1em;
  background:#90CAF9;
}
</style>

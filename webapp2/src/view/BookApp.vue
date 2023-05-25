<template>
  <div>
    <!-- 検索機能部 -->
    <Search
      :formGenreList="formGenreList"
      @searchBook='searchBook'
      @searchClear='searchClear'
    />
    <!-- 新規登録機能部 -->
    <v-row>
      <v-col class="pt-0">
        <v-btn
          color="teal accent-2"
          @click="openForm">
          <v-icon left>mdi-pencil-plus</v-icon>書籍を登録
        </v-btn>
      </v-col>
    </v-row>
    <!-- 書籍一覧表示部 -->
    <List
      :items="items"
      @openEditForm='openEditForm'
      @reloadItem='reloadItem'
      @notifyFailure='notifyFailure'
    />
    <!-- 入力フォーム部 -->
    <Form
      :showForm="showForm"
      :isNewBook="isNewBook"
      :formGenreList="formGenreList"
      :selectedBookId="selectedBookId"
      :selectedTitle="selectedTitle"
      :selectedGenreId="selectedGenreId"
      :selectedPurchaseDate="selectedPurchaseDate"
      :selectedPurchaseName="selectedPurchaseName"
      :selectedReview="selectedReview"
      @reloadItem='reloadItem'
      @closeForm='closeForm'
      @notifyFailure='notifyFailure'
    />
    <!-- DBアクセス時に表示するオーバーレイ -->
    <v-overlay :value="overlay">
      <v-progress-circular indeterminate size="64">
      </v-progress-circular>
    </v-overlay>
  </div>
</template>

<script>
import Search from '@/components/Search.vue'
import List from '@/components/List.vue'
import Form from '@/components/Form.vue'
export default {
  components: {
    Search,
    List,
    Form
  },
  data () {
    return {
      items: [],
      formGenreList: [],
      selectedBookId: '',
      selectedTitle: '',
      selectedGenreId: '',
      selectedPurchaseDate: '',
      selectedPurchaseName: '',
      selectedReview: '',
      searchTitle: '',
      searchGenre: '',
      isFilteredView: false,
      isNewBook: false,
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
      this.formGenreList = initialGet[1]
    },
    // 書籍テーブルリロード
    async reloadItem () {
      this.overlay = true
      try {
        this.items = await this.readBookTableAll() // 書籍一覧更新
      } catch (e) {
        this.notifyFailure()
      }
      this.overlay = false
      this.isNewBook = false
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
    // GASを使用し検索条件を指定して書籍テーブルを読み込み、Promise返却
    readBookTableFiltering () {
      return new Promise((resolve, reject) => {
        google.script.run // eslint-disable-line no-undef
          .withSuccessHandler((result) => resolve(result))
          .withFailureHandler((error) => reject(error))
          .readBookTableFiltering(this.searchTitle, this.searchGenre)
      })
    },
    // 書籍新規登録フォーム表示
    openForm () {
      this.isNewBook = true
      this.showForm = true
    },
    // 書籍編集フォーム表示
    openEditForm (
      bookId,
      title,
      genreId,
      purchaseDate,
      purchaseName,
      review) {
      this.selectedBookId = bookId
      this.selectedTitle = title
      this.selectedGenreId = genreId
      this.selectedPurchaseDate = purchaseDate
      this.selectedPurchaseName = purchaseName
      this.selectedReview = review
      this.isNewBook = false
      this.showForm = true
    },
    // 入力フォームクローズ
    closeForm () {
      this.showForm = false
    },
    // 書籍を検索
    async searchBook (
      searchTitle,
      searchGenre) {
      this.searchTitle = searchTitle
      this.searchGenre = searchGenre
      if (!this.searchTitle && !this.searchGenre) {
        alert('検索条件が指定されていません')
      } else {
        try {
          this.overlay = true
          this.items = await this.readBookTableFiltering()
          this.overlay = false
          this.isFilteredView = true
        } catch (e) {
          this.notifyFailure()
        }
      }
    },
    // 検索条件クリア
    async searchClear () {
      // 検索結果を表示中の場合は全件表示に戻す
      if (this.isFilteredView) {
        try {
          this.overlay = true
          this.items = await this.readBookTableAll()
          this.isFilteredView = false
          this.overlay = false
        } catch (e) {
          this.notifyFailure()
        }
      }
    },
    // DBアクセス異常通知
    notifyFailure () {
      alert('DBにアクセス出来ませんでした。DBの状態を確認してください！')
      this.overlay = false
    }
  }
}
</script>

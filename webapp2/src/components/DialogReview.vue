<template>
  <div>
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
  </div>
</template>

<script>
export default {
  props: {
    dialogReview: Boolean,
    selectedTitle: String,
    selectedReview: String
  },
  data () {
    return {}
  },
  computed: {
    reviewTitle () {
      return `【${this.selectedTitle}】のレビュー`
    }
  },
  methods: {
    closeReview () {
      this.$emit('closeReview')
    }
  }
}
</script>

<template>
  <div>
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
  </div>
</template>

<script>
export default {
  props: {
    dialogDelete: Boolean,
    selectedTitle: String
  },
  data () {
    return {}
  },
  computed: {
    dialogTitle () {
      return `【${this.selectedTitle}】を削除しますか？`
    }
  },
  methods: {
    deleteItemConfirm () {
      this.$emit('deleteItemConfirm')
    },
    closeDelete () {
      this.$emit('closeDelete')
    }
  }
}
</script>

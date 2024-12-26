<template>
   <div>
      <!-- search box -->
      <VCard class="pa-5 mb-3">
         <VRow align="center">
            <VCol cols="12" md="3" sm="3">
               <VTextField v-model="searchQuery" clearable single-line label="Search For Article"
                  @input="filterArticles" color="success" />
            </VCol>
            <VCol cols="12" md="3" sm="2">
               <VBtn @click="isFilterMenuOpen = !isFilterMenuOpen" :color="isFilterMenuOpen ? 'success' : 'dark'">
                  <VIcon size="x-large" icon="mdi-filter-outline" />
               </VBtn>
            </VCol>

            <VCard>
               <VTabs color="success" v-model="viewMode">
                  <v-tab value="list">
                     <VIcon size="x-large" icon="mdi-view-list-outline" />
                  </v-tab>
                  <v-tab value="grid">
                     <VIcon size="x-large" icon="mdi-grid-large" />
                  </v-tab>
               </VTabs>
            </VCard>
            <VCol cols="12" md="2" sm="3" align="left">
               <VBtn color="success" @click="openAddNewArticleDialog">Add New Article</VBtn>
            </VCol>

         </VRow>
      </VCard>

      <!-- filters transition -->
      <VExpandTransition>
         <VCard v-show="isFilterMenuOpen" class="my-2 mx-auto pa-2">
            <VList dense>
               <VListItemTitle>
                  <span class="text-xl px-4">Filters</span>
                  <VBtn color="success" @click="resetFilters">
                     <VIcon size="x-large" icon="mdi-restore" />
                  </VBtn>
               </VListItemTitle>
               <VRow class="ma-1">
                  <VCol cols="12" md="6" sm="6">
                     <VTextField color="success" v-model="filterTitle" label="Title" clearable
                        @input="filterArticles" />
                  </VCol>
                  <VCol cols="12" md="6" sm="6">
                     <VTextField color="success" v-model="filterDate" label="Date" clearable @input="filterArticles" />
                  </VCol>
               </VRow>
            </VList>
         </VCard>
      </VExpandTransition>

      <!-- list view -->
      <div v-if="viewMode === 'list'">
         <VTable min-height="300px">
            <thead>
               <tr>
                  <th>Title</th>
                  <th>Image</th>
                  <th>Date</th>
                  <th>Actions</th>
               </tr>
            </thead>
         </VTable>
         <VCard v-for="article in paginatedListArticles" :key="article.id" @click="showArticleDetails(article)">
            <VTable class="pa-2" min-height="300px">
               <tbody>
                  <tr>
                     <td>{{ article.title }}</td>
                     <td><img :src="article.image" alt="image view" loading="lazy" style="width:100px; height:50px;">
                     </td>
                     <td>{{ article.date }}</td>
                     <td>
                        <VRow no-gutters align="left">
                           <VCol cols="6" align="left">
                              <VBtn variant="plain" @click.stop="openEditDialog(article)">
                                 <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                 <VIcon size="x-large" icon="mdi-pencil" />
                              </VBtn>
                           </VCol>
                           <VCol cols="2">
                              <VBtn color="error" variant="plain" @click.stop="openDeleteDialog(article)">
                                 <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                                 <VIcon size="x-large" icon="mdi-trash-can" />
                              </VBtn>
                           </VCol>
                        </VRow>
                     </td>
                  </tr>
               </tbody>
            </VTable>
            <VDivider></VDivider>
         </VCard>
         <VPagination v-model="listCurrentPage" :length="totalListPages" :total-visible="5" />
      </div>

      <!-- grid view -->
      <div v-if="viewMode === 'grid'">
         <VRow>
            <VCol cols="12" sm="4" md="4"
               v-for="article in paginatedGridArticles.length ? paginatedGridArticles : articles" :key="article.id">
               <VCard class="pa-2" @click="showArticleDetails(article)">
                  <VRow>
                     <VCol cols="12">
                        <div class="pa-3">
                           <img :src="article.image" style="width:100% ; height:150px;" class="mb-5 " alt="image view">

                           <p align="left" class="mb-5">
                              <strong>Title: </strong> <span
                                 style=" background-color:rgb(60, 60, 90); padding:3px; border-radius: 15%;">{{
                                    article.title }}</span>
                           </p>
                           <p align="left" class="">
                              <strong>Date: </strong> <span
                                 style=" background-color:rgb(60, 60, 90);  padding:3px; border-radius: 15%;">{{
                                    article.date }}</span>
                           </p>
                        </div>
                     </VCol>
                  </VRow>
                  <VRow dense>
                     <VCol cols="12" align="left">
                        <VBtn @click.stop="openEditDialog(article)" variant="plain">
                           <VTooltip activator="parent" location="top">Edit</VTooltip>
                           <VIcon icon="mdi-pencil" size="x-large" />
                        </VBtn>
                        <VBtn @click.stop="openDeleteDialog(article)" variant="plain" color="dark">
                           <VTooltip activator="parent" location="top">Delete</VTooltip>
                           <VIcon icon="mdi-trash-can" size="x-large" color="error" />
                        </VBtn>
                     </VCol>
                  </VRow>
               </VCard>
            </VCol>
         </VRow>
         <VPagination v-model="gridCurrentPage" :length="totalGridPages" :total-visible="5" />

      </div>

      <!-- add new article dialog -->
      <VDialog v-model="addDialogVisible" persistent>
         <VCard class="mx-auto" width="440px">
            <VCardTitle align="left">Add New Article</VCardTitle>
            <VCardText align="left" class="text-center">
               <VCol align="left" cols="12 " lg="12" md="8" class="text-center">
                  <VTextField v-model="newArticle.title" required class="mb-3" label="Title" />
                  <VFileInput accept="image/*" v-model="newArticle.image" required class="mb-3" label="Image"
                     @change="(e: any) => handleImageUpload(e, 'add')" />
                  <div v-if="newArticle.imagePreview" class="mt-3">
                     <p class="mb-2">Preview Image</p>
                     <img style="                  
                  max-width: 200px;
                  max-height: 150px;
                  object-fit: contain;
                  border-radius: 4px" :src="newArticle.imagePreview" alt="Preview Image">
                  </div>

               </VCol>
            </VCardText>
            <VCardActions>
               <VBtn color="error" @click="cancelAddArticle">Cancel</VBtn>
               <VBtn @click="saveNewArticle" color="success">Save</VBtn>
            </VCardActions>
         </VCard>
      </VDialog>

      <!-- show  details dialog -->
      <VDialog v-model="detailsDialogVisible">
         <VCard width="450px" class="mx-auto pa-3">
            <VCardTitle>Article Details</VCardTitle>
            <VCardText>
               <p class="mb-2"><strong>Title: </strong> {{ selectedArticle.title }}</p>
               <p class="mb-2"><strong>Date: </strong>{{ selectedArticle.date }}</p>
               <img :src="selectedArticle.image" alt="image view" style="width:200px; height:150px">
            </VCardText>
            <VCardActions>
               <VBtn @click="detailsDialogVisible = false">Close</VBtn>
            </VCardActions>
         </VCard>
      </VDialog>

      <!-- delete dialog -->
      <VDialog v-model="deleteDialogVisible">
         <VCard width="400px" class="mx-auto pa-2">
            <VCardTitle>Confirm Deletion</VCardTitle>
            <VCardText>? Are you sure you want to delete this Article </VCardText>
            <VCardActions>
               <VBtn @click="deleteArticle(deleteArticleTarget)" color="error">Delete</VBtn>
               <VBtn @click="deleteDialogVisible = false">Cancel</VBtn>
            </VCardActions>
         </VCard>
      </VDialog>

      <!-- edit dialog -->
      <VDialog v-model="editDialogVisible">
         <VCard class="mx-auto pa-3" width="500px">
            <VCardTitle>Edit Article</VCardTitle>
            <VCardText>
               <VTextField v-model="editArticleTarget.title" label="Title" required class="mb-5" />
               <VFileInput accept="image/*" required class="mt-5" label="Image"
                  @change="(e: any) => handleImageUpload(e, 'edit')" />
               <div class="mt-5" v-if="editArticleTarget.image">
                  <img style="max-width: 200px; max-height: 150px; object-fit: contain" :src="editArticleTarget.image"
                     alt="Preview">
               </div>
            </VCardText>
            <VCardActions>
               <VBtn @click="cancelEdit">Cancel</VBtn>
               <VBtn @click="saveEditedArticle" :loading="isSaving" color="success">Save</VBtn>
            </VCardActions>
         </VCard>
      </VDialog>

      <VProgressCircular v-if="isSaving" intermediate />
   </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';

const formatDate = (date: Date) => {
   const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
   };
   return new Intl.DateTimeFormat('en-CA', options).format(date).replace(', ', ' ');
};
const viewMode: any = ref('list')
const searchQuery: any = ref("")

const articles = ref([
   { id: 1, title: "Article 1", image: 'images/pages/1.png', date: formatDate(new Date('2013-03-03 14:00')) },
   { id: 2, title: "Article 2", image: 'images/pages/2.png', date: formatDate(new Date('2022-09-08 17:00')) },
   { id: 3, title: "Article 3", image: 'images/pages/3.png', date: formatDate(new Date('2000-03-03 12:00')) },
   { id: 4, title: "Article 4", image: 'images/pages/2.png', date: formatDate(new Date('2010-03-08 23:00')) },
   { id: 5, title: "Article 5", image: 'images/pages/3.png', date: formatDate(new Date('2018-03-13 14:50')) },
   { id: 6, title: "Article 6", image: 'images/pages/1.png', date: formatDate(new Date('2020-10-23 14:20')) },
   { id: 7, title: "Article 7", image: 'images/pages/2.png', date: formatDate(new Date('2022-11-03 2:30')) },
   { id: 8, title: "Article 8", image: 'images/pages/3.png', date: formatDate(new Date('2003-05-03 4:10')) },
])
const newArticle: any = ref({
   title: "", date: "", image: "", imagePreview: null
})

const detailsDialogVisible: any = ref(false)
const deleteDialogVisible: any = ref(false)
const editDialogVisible: any = ref(false)
const addDialogVisible: any = ref(false)

const isSaving = ref(false)

const isFilterMenuOpen = ref(false)
const filteredArticles: any = ref([])
const filterTitle = ref("")
const filterDate = ref("")

const selectedArticle: any = ref(null)
const deleteArticleTarget: any = ref(null)
const editArticleTarget: any = ref({
   id: null, title: "", date: "", image: ""
})

const articlesPerPage: any = ref(5)
const gridCurrentPage: any = ref(1)
const listCurrentPage: any = ref(1)

const imagePreview = ref<string | null>(null)

const totalGridPages = computed(() =>
   Math.ceil(filteredArticles.value.length / articlesPerPage.value)
)

const totalListPages = computed(() =>
   Math.ceil(filteredArticles.value.length / articlesPerPage.value)
)


onMounted(() => {
   filterArticles()
})
const paginatedListArticles = computed(() => {
   const startIndex = (listCurrentPage.value - 1) * articlesPerPage.value
   return filteredArticles.value.slice(startIndex, startIndex + articlesPerPage.value)
})

const paginatedGridArticles = computed(() => {
   const startIndex = (gridCurrentPage.value - 1) * articlesPerPage.value
   return filteredArticles.value.slice(startIndex, startIndex + articlesPerPage.value)

})

const openAddNewArticleDialog = () => {
   addDialogVisible.value = true
}

const openEditDialog = (article: any) => {
   editArticleTarget.value = { ...article }
   editDialogVisible.value = true
}
const openDeleteDialog = (article: any) => {
   deleteArticleTarget.value = article
   deleteDialogVisible.value = true
}

const showArticleDetails = (article: any) => {
   selectedArticle.value = article
   detailsDialogVisible.value = true

}

const handleImageUpload = (event: Event, mode: 'add' | 'edit') => {
   const fileInput = event.target as HTMLInputElement
   const file = fileInput.files?.[0]
   if (!file) {
      alert("please select an image")
      if (mode === 'add') {
         newArticle.value.imagePreview = null

      } else {
         editArticleTarget.value = ""
      }
      return
   }

   const maxSize = 5 * 1024 * 1024
   if (file.size > maxSize) {
      alert("ImageSize must be less than 5MB. please choose another image")
      fileInput.value = ""
      if (mode === 'add') {
         newArticle.value.imagePreview = null
      }
      else {
         editArticleTarget.value.image = " ";
      }
      return
   }

   const reader = new FileReader()
   reader.onload = (e) => {
      const imageResult = e.target?.result as string
      if (mode === "add") {
         newArticle.value.imagePreview = imageResult
         newArticle.value.image = file
      }
      else {
         editArticleTarget.value.image = imageResult
      }

   }
   reader.onerror = () => {
      alert("error reading file.")
      if (mode === "add") {
         imagePreview.value = null
      }
      else {
         editArticleTarget.value.image = " ";
      }
   }
   reader.readAsDataURL(file)
}

const filterArticles = () => {
   if (!articles.value || articles.value.length === 0) {
      filteredArticles.value = []
      return filterArticles()
   }
   filteredArticles.value = articles.value.filter((article: any) => {
      const matchesSearchQuery =
         !searchQuery.value
         || article.title.toLowerCase().includes(searchQuery.value.toLowerCase())
         || article.date.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchesTitle =
         !filterTitle.value || article.title.toLowerCase().includes(filterTitle.value.toLowerCase())
      const matchesDate =
         !filterDate.value || article.date.toLowerCase().includes(filterDate.value.toLowerCase())
      return (matchesSearchQuery && matchesTitle && matchesDate)

   })
}

const resetFilters = () => {
   searchQuery.value = ""
   filterTitle.value = ""
   filterDate.value = ""
   filterArticles()
}

const cancelAddArticle = () => {
   addDialogVisible.value = false
   newArticle.value = {
      title: "", date: "", image: "", imagePreview: null
   }
   isSaving.value = false
}

const cancelEdit = () => {
   editDialogVisible.value = false
   editArticleTarget.value = {
      id: null, title: "", date: "", image: ""
   }
}

const saveNewArticle = () => {
   isSaving.value = true
   if (!newArticle.value.title?.trim()) {
      alert("please fill in all fields to continue. ")
      return;
   }
   if (!newArticle.value.image) {
      alert("please select an image.")
      return;
   }


   const newArticleData = {
      id: Date.now(),
      title: newArticle.value.title?.trim(),
      date: formatDate(new Date()),
      image: newArticle.value.imagePreview
   }
   articles.value = [...articles.value, { ...newArticleData }]
   cancelAddArticle();
   filterArticles();
}

const saveEditedArticle = () => {
   isSaving.value = true
   if (
      !editArticleTarget.value.title?.trim() ||
      !editArticleTarget.value.date?.trim()
   ) {
      alert("please fill in all fields.")
      return
   }
   setTimeout(() => {
      const index = articles.value.findIndex(a => a.id === editArticleTarget.value.id)
      if (index !== -1) {
         const updatedArticle = {
            ...articles.value[index],
            title: editArticleTarget.value.title.trim(),
            date: editArticleTarget.value.date.trim(),
            image: editArticleTarget.value.image
         }
         articles.value[index] = updatedArticle
         articles.value = [...articles.value]
         filterArticles()

      }
      cancelEdit()
      isSaving.value = false
   }, 1000)
}

const deleteArticle = (articleToDelete: any) => {
   articles.value = articles.value.filter(a => a.id !== articleToDelete.id)
   deleteArticleTarget.valueOf = null
   deleteDialogVisible.value = false
   filterArticles()
}
watch([filterTitle, filterDate, searchQuery], () => {
   filterArticles()
   gridCurrentPage.value = 1
   listCurrentPage.value = 1
}, { immediate: true }
)


</script>

<style scoped></style>
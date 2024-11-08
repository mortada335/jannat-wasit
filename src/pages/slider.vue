<template>
  <div>
    <!-- Header with Add New Partnership Button -->
    <VCard height="80px" class="pa-5">
      <VRow justify="left">
        <VCol cols="12" md="12" sm="6" class="text-left">
          <VBtn color="success" @click="openAddPartnerDialog">Add New Partnership</VBtn>
        </VCol>
      </VRow>
    </VCard>

    <!-- List of Partnerhips -->
    <VRow>
      <VCol v-for="item in items" :key="item.id" cols="12" md="4" sm="4" class="my-5">
        <VCard class="pa-3" @click="showPartnerDetails(item)" max-width="400px" min-height="300px">
          <VRow>
            <VCol cols="12">
              <VImg width="400px" :src="item.img" />
            </VCol>     
          </VRow>
          <VRow justify="" dense>
            <VCol cols="12" md="8" sm="8">
              Actions:
              <VBtn @click.stop="openEditDialog(item)" variant="plain" color="primary">
                <VTooltip activator="parent" location="top">Edit</VTooltip>
                <VIcon size="large" icon="mdi-pencil" />
              </VBtn>
              <VBtn @click.stop="openDeleteDialog(item)" variant="plain" color="error">
                <VTooltip activator="parent" location="top">Delete</VTooltip>
                <VIcon size="large" icon="mdi-delete" />
              </VBtn>
            </VCol>
          </VRow>
        </VCard>
      </VCol>
    </VRow>

    <!-- Add Partner Dialog -->
    <VDialog v-model="addPartnerDialogVisible">
      <VCard class="mx-auto" width="440px">
        <VCardTitle>Add New Partnership</VCardTitle>
        <VCardText class="text-center">
          <VTextField v-model="newPartner.img" clearable label="Picture."/>
        </VCardText>
        <VCardActions>
          <VBtn @click="addPartnerDialogVisible = false" color="error">Cancel</VBtn>
          <VBtn @click="saveNewPartner" color="success">Save</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Edit Partner Dialog -->
    <VDialog v-model="editPartnerDialogVisible">
    <VCard class="mx-auto" width="440px">
    <VCardTitle>edit Partnership</VCardTitle>
    <VRow>
    <VCol cols="12" md="8" sm="6">
      <VTextField class="my-3" v-model="editPartnerTarget.img" label="image"/>
    </VCol>
    </VRow>
    <VCardActions>
    <VBtn @click="editPartnerDialogVisible=false" color="error">Cancel</VBtn>
    <VBtn :loading="isSaving" @click="saveEditedPartner" color="success">Save</VBtn>
    </VCardActions>
    </VCard>
    </VDialog>

    <!-- Show Partner Dialog -->
    <VDialog v-model="showPartnerDialogVisible">
      <VCard class="mx-auto" width="400px">
        <VCardTitle>View Partnership</VCardTitle>
        <VCardText>
          <VImg :src="selectedItem.img" />
        </VCardText>
        <VCardActions>
          <VBtn @click="showPartnerDialogVisible = false" color="primary">Close</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Partner Dialog -->
    <VDialog v-model="deletePartnerDialogVisible">
      <VCard class="mx-auto" width="400px">
        <VCardTitle>Confirm Deletion</VCardTitle>
        <VCardText>Are you sure you want to delete this partnership?</VCardText>
        <VCardActions>
          <VBtn @click="confirmDeletePartner" color="error">Delete</VBtn>
          <VBtn @click="deletePartnerDialogVisible = false" color="primary">Cancel</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VProgressCircular v-if="isSaving" indeterminate />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const addPartnerDialogVisible = ref(false);
const editPartnerDialogVisible = ref(false);
const showPartnerDialogVisible = ref(false);
const deletePartnerDialogVisible = ref(false);
const isSaving = ref(false);
const newPartner = ref({ img: "" });
const selectedItem: any = ref();
const editPartnerTarget: any = ref({});
const deleteItemTarget: any = ref();

const items = ref([
  { id: 1, img: "/src/assets/images/pages/1.png" },
  { id: 2, img: "/src/assets/images/pages/2.png" },
  { id: 3, img: "/src/assets/images/pages/3.png" },
  { id: 4, img: "/src/assets/images/pages/3.png" },
]);

const openAddPartnerDialog = () => {
  addPartnerDialogVisible.value = true;
};

const saveNewPartner = () => {
  if (newPartner.value.img) {
    items.value= [...items.value, {...newPartner.value , id:Date.now()}]
    newPartner.value.img = "";
    addPartnerDialogVisible.value = false;
  } else {
    alert("Please select an image to continue.");
  }
};

const openEditDialog = (item: any) => {
  editPartnerTarget.value = { ...item };
  editPartnerDialogVisible.value = true;
};

const saveEditedPartner = () => {
  isSaving.value = true;
  setTimeout(() => {
    const index = items.value.findIndex((i) => i.id === editPartnerTarget.value.id);
    if (index !== -1) {
      items.value[index] = { ...editPartnerTarget.value };
    }
    editPartnerDialogVisible.value=false
    isSaving.value=false
  }, 1000);
};

const showPartnerDetails = (item: any) => {
  selectedItem.value = item;
  showPartnerDialogVisible.value = true;
};

const openDeleteDialog = (item: any) => {
  deleteItemTarget.value = item;
  deletePartnerDialogVisible.value = true;
};

const confirmDeletePartner = () => {
  items.value = items.value.filter((i) => i.id !== deleteItemTarget.value.id);
  deletePartnerDialogVisible.value = false;
};
</script>

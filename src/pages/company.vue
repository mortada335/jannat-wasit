<template>
  <div>
    <!-- Header with Add New Partnership Button -->
    <VCard height="80px" class="pa-5">
      <VRow justify="left">
        <VCol cols="12" md="12" sm="3" class="text-left">
          <VBtn color="success" @click="openAddPartnerDialog">Add New Partnership</VBtn>
        </VCol>
      </VRow>
    </VCard>

    <!-- List of Partnerhips -->
    <VRow no-gutters>
      <VCol v-for="item in partners" :key="item.id" cols="12" md="6" sm="8" lg="4" class="mt-4">
        <VCard class="card-style" @click="showPartnerDetails(item)">
          <VRow>
            <VCol>
              <img class="card-image" alt="img view" :src="item.img" />
            </VCol>
          </VRow>
          <VRow dense>
            <VCol cols="12" class="action-buttons">
              Actions:
              <VBtn @click.stop="openEditDialog(item)" variant="plain" color="success">
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
          <VFileInput accept="image/*" @change="handleNewPartnerImageUpload" v-model="newPartner.img" clearable
            label="Picture." />
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
        <VCardTitle>Edit Partnership</VCardTitle>

        <VCardText class="text-center">
          <VFileInput clearable label="Picture" class="my-3" accept="image/*" @change="handleEditedPartnerImage" />
          <!-- Preview the uploaded image -->
          <img v-if="editPartnerTarget.img" :src="editPartnerTarget.img" alt="Preview" class="preview-image" />
        </VCardText>

        <VCardActions>
          <VBtn @click="editPartnerDialogVisible = false" color="error">Cancel</VBtn>
          <VBtn :loading="isSaving" @click="saveEditedPartner" color="success">Save</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
    <!-- Show Partner Dialog -->
    <VDialog v-model="showPartnerDialogVisible">
      <VCard class="mx-auto" width="400px">
        <VCardTitle>View Partnership</VCardTitle>
        <VCardText>
          <img :src="selectedItem.img" />
        </VCardText>
        <VCardActions>
          <VBtn @click="showPartnerDialogVisible = false" color="success">Close</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Partner Dialog -->
    <VDialog v-model="deletePartnerDialogVisible">
      <VCard class="mx-auto" width="350px">
        <VCardTitle>{{ t("Confirm Deletion") }}</VCardTitle>
        <VCardText>Are you sure you want to delete this partnership?</VCardText>
        <VCardActions>
          <VBtn @click="deletePartner" color="error">Delete</VBtn>
          <VBtn @click="deletePartnerDialogVisible = false" color="success">Cancel</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VProgressCircular v-if="isSaving" indeterminate />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const emit = defineEmits(["update", "close", "save"]);
const addPartnerDialogVisible = ref(false);
const editPartnerDialogVisible = ref(false);
const showPartnerDialogVisible = ref(false);
const deletePartnerDialogVisible = ref(false);

const isSaving = ref(false);
const newPartner: any = ref({ id: null, img: "" });
const selectedItem: any = ref();
const editPartnerTarget: any = ref({
  id: null,
  img: "",
});
const deleteItemTarget: any = ref();
const { t } = useI18n();

const partners = ref([
  { id: 1, img: "images/pages/6.jpg" },
  { id: 2, img: "images/pages/1.png" },
  { id: 3, img: "images/pages/2.png" },
  { id: 4, img: "images/pages/3.png" },
]);

const openAddPartnerDialog = () => {
  addPartnerDialogVisible.value = true;
};

const openDeleteDialog = (item: any) => {
  deleteItemTarget.value = item;
  deletePartnerDialogVisible.value = true;
};

const openEditDialog = (item: any) => {
  editPartnerTarget.value = { ...item };
  editPartnerDialogVisible.value = true;
};
const saveNewPartner = () => {
  if (newPartner.value.img) {
    isSaving.value = true;
    partners.value.push({
      id: Date.now(),
      img: newPartner.value.img,
    });
    newPartner.value.img = "";
    addPartnerDialogVisible.value = false;
    isSaving.value = false;
  } else {
    alert("Please upload a valid image.");
  }
};

const saveEditedPartner = () => {
  if (!editPartnerTarget.value.img) {
    alert("Please upload a valid image.");
  }
  isSaving.value = true;
  setTimeout(() => {
    const index = partners.value.findIndex(
      (i) => i.id === editPartnerTarget.value.id
    );
    if (index !== -1) {
      partners.value[index] = { ...editPartnerTarget.value };
    }
    editPartnerDialogVisible.value = false;
    isSaving.value = false;
  }, 1000);
};

const handleEditedPartnerImage = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        editPartnerTarget.value.img = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }
};

const handleNewPartnerImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      newPartner.value.img = reader.result as string;
    };
    reader.readAsDataURL(file);
  } else {
    alert("Please select a valid image file.");
  }
};

const showPartnerDetails = (item: any) => {
  selectedItem.value = item;
  showPartnerDialogVisible.value = true;
};

const deletePartner = () => {
  partners.value = partners.value.filter(
    (i) => i.id !== deleteItemTarget.value.id
  );
  deletePartnerDialogVisible.value = false;
};
</script>
<style>
.card-style {
  width: 440px;
  height: 340px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
}

.card-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  /* Adds space between the buttons */
}
</style>

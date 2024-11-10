<template>
  <div>
    <!-- Header with Add New Slider Button -->
    <VCard height="80px" class="pa-5">
      <VRow justify="left">
        <VCol cols="12" md="10" sm="4">
          <VBtn color="success" @click="openAddSliderDialog"
            >Add New Slider</VBtn
          >
        </VCol>
      </VRow>
    </VCard>

    <!-- List of Sliderhips -->
    <VRow no-gutters>
      <VCol
        v-for="item in Sliders"
        :key="item.id"
        cols="12"
        md="4"
        sm="8"
        class="mt-4"
      >
        <VCard class="card-style" @click="showSliderDetails(item)">
          <VRow>
            <VCol cols="12">
              <img :src="item.img" :width="250" :height="100" />
            </VCol>
          </VRow>
          <VRow dense>
            <VCol cols="12" class="action-buttons">
              Actions:
              <VBtn
                @click.stop="openEditDialog(item)"
                variant="plain"
                color="primary"
              >
                <VTooltip activator="parent" location="top">Edit</VTooltip>
                <VIcon size="large" icon="mdi-pencil" />
              </VBtn>
              <VBtn
                @click.stop="openDeleteDialog(item)"
                variant="plain"
                color="error"
              >
                <VTooltip activator="parent" location="top">Delete</VTooltip>
                <VIcon size="large" icon="mdi-delete" />
              </VBtn>
            </VCol>
          </VRow>
        </VCard>
      </VCol>
    </VRow>
    <!-- Add Slider Dialog -->
    <VDialog v-model="addSliderDialogVisible">
      <VCard class="mx-auto" width="440px">
        <VCardTitle>Add New Slider</VCardTitle>
        <VCardText class="text-center">
          <VFileInput
            v-model="newSlider.img"
            clearable
            label="Picture."
            accept="image/*"
          />
        </VCardText>
        <VCardActions>
          <VBtn @click="addSliderDialogVisible = false" color="error"
            >Cancel</VBtn
          >
          <VBtn @click="saveNewSlider" color="success">Save</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Edit Slider Dialog -->
    <VDialog v-model="editSliderDialogVisible">
      <VCard class="mx-auto" width="440px">
        <VCardTitle>Edit Slider</VCardTitle>

        <VCardText class="text-center">
          <VFileInput
            clearable
            label="Picture"
            class="my-3"
            accept="image/*"
            @change="handleImageUpload"
          />
          <!-- Preview the uploaded image -->
          <img
            v-if="editSliderTarget.img"
            :src="editSliderTarget.img"
            alt="Preview"
            class="preview-image"
          />
        </VCardText>

        <VCardActions>
          <VBtn @click="editSliderDialogVisible = false" color="error"
            >Cancel</VBtn
          >
          <VBtn :loading="isSaving" @click="saveEditedSlider" color="success"
            >Save</VBtn
          >
        </VCardActions>
      </VCard>
    </VDialog>
    <!-- Show Slider Dialog -->
    <VDialog v-model="showSliderDialogVisible">
      <VCard class="mx-auto" width="400px">
        <VCardTitle>View Slider</VCardTitle>
        <VCardText>
          <img :src="selectedItem.img" />
        </VCardText>
        <VCardActions>
          <VBtn @click="showSliderDialogVisible = false" color="success"
            >Close</VBtn
          >
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Slider Dialog -->
    <VDialog v-model="deleteSliderDialogVisible">
      <VCard class="mx-auto" width="350px">
        <VCardTitle>{{ t("Confirm Deletion") }}</VCardTitle>
        <VCardText>Are you sure you want to delete this Slider?</VCardText>
        <VCardActions>
          <VBtn @click="confirmDeleteSlider" color="error">Delete</VBtn>
          <VBtn @click="deleteSliderDialogVisible = false" color="success"
            >Cancel</VBtn
          >
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
const addSliderDialogVisible = ref(false);
const editSliderDialogVisible = ref(false);
const showSliderDialogVisible = ref(false);
const deleteSliderDialogVisible = ref(false);

const isSaving = ref(false);
const newSlider: any = ref({ img: "" });
const selectedItem: any = ref();
let editSliderTarget: any = ref({
  id: null,
  img: "",
});
const deleteItemTarget: any = ref();
const { t } = useI18n();

const Sliders = ref([
  { id: 1, img: "/public/images/pages/5.jpg" },
  { id: 2, img: "/public/images/pages/1.png" },
  { id: 3, img: "/public/images/pages/1.png" },
  { id: 4, img: "/public/images/pages/3.png" },
]);

const openAddSliderDialog = () => {
  addSliderDialogVisible.value = true;
};

const openDeleteDialog = (item: any) => {
  deleteItemTarget.value = item;
  deleteSliderDialogVisible.value = true;
};

const openEditDialog = (item: any) => {
  editSliderTarget.value = { ...item };
  editSliderDialogVisible.value = true;
};
const saveNewSlider = () => {
  if (newSlider.value.img) {
    Sliders.value = [...Sliders.value, { ...newSlider.value, id: Date.now() }];
    newSlider.value.img = "";
    addSliderDialogVisible.value = false;
  } else {
    alert("Please select an image to continue.");
  }
};

const saveEditedSlider = () => {
  isSaving.value = true;
  setTimeout(() => {
    const index = Sliders.value.findIndex(
      (i) => i.id === editSliderTarget.value.id
    );
    if (index !== -1) {
      Sliders.value[index] = { ...editSliderTarget.value };
    }
    editSliderDialogVisible.value = false;
    isSaving.value = false;
  }, 1000);
};

const handleImageUpload = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        // Assign the data URL to editSliderTarget.img for preview and editing
        editSliderTarget.value.img = reader.result;
      }
    };
    reader.readAsDataURL(file); // Read the file as a data URL
  }
};

const showSliderDetails = (item: any) => {
  selectedItem.value = item;
  showSliderDialogVisible.value = true;
};

const confirmDeleteSlider = () => {
  Sliders.value = Sliders.value.filter(
    (i) => i.id !== deleteItemTarget.value.id
  );
  deleteSliderDialogVisible.value = false;
};
</script>
<style>
.card-style {
  width: 400px;
  height: 330px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
}

.action-buttons {
  display: flex;
  align-items: center;
  gap: 8px; /* Adds space between the buttons */
}
</style>

// must edit img
<template>
  <div>
    <!-- Header with Add New Slider Button -->
    <VCard height="80px" class="pa-5">
      <VRow justify="left">
        <VCol cols="12" md="12" sm="3" class="text-left">
          <VBtn color="success" @click="openAddSliderDialog">Add New Slider</VBtn>
        </VCol>
      </VRow>
    </VCard>

    <!-- List of Sliderhips -->
    <VRow no-gutters>
      <VCol cols="12" md="6" sm="8" lg="4" class="mt-4" v-for="item in sliders" :key="item.id">
        <VCard class="card-style mb-4" @click="showSliderDetails(item)">
          <VRow>
            <VCol>
              <img class="card-image" :src="item.img" alt="img view" />
            </VCol>
          </VRow>
          <VRow dense>
            <VCol cols="12" class="action-buttons">
              Actions:
              <VBtn @click.stop="openEditDialog(item)" variant="plain" color="success">
                <VTooltip activator="parent" location="top">Edit</VTooltip>
                <VIcon size="x-large" icon="mdi-pencil" />
              </VBtn>
              <VBtn @click.stop="openDeleteDialog(item)" variant="plain" color="error">
                <VTooltip activator="parent" location="top">Delete</VTooltip>
                <VIcon size="x-large" icon="mdi-delete" />
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
          <VFileInput @change="handleNewSliderImage" v-model="newSlider.img" clearable label="Picture."
            accept="image/*" />
        </VCardText>
        <VCardActions>
          <VBtn @click="addSliderDialogVisible = false" color="error">Cancel</VBtn>
          <VBtn @click="saveNewSlider" color="success">Save</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Edit Slider Dialog -->
    <VDialog v-model="editSliderDialogVisible">
      <VCard class="mx-auto" width="440px">
        <VCardTitle>Edit Slider</VCardTitle>

        <VCardText class="text-center">
          <VFileInput clearable label="Picture" class="my-3" accept="image/*" @change="handleEditedSliderImage" />
          <!-- Preview the uploaded image -->
          <img v-if="editSliderTarget.img" :src="editSliderTarget.img" alt="Preview" class="preview-image" />
        </VCardText>

        <VCardActions>
          <VBtn @click="editSliderDialogVisible = false" color="error">Cancel</VBtn>
          <VBtn :loading="isSaving" @click="saveEditedSlider" color="success">Save</VBtn>
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
          <VBtn @click="showSliderDialogVisible = false" color="success">Close</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- Delete Slider Dialog -->
    <VDialog v-model="deleteSliderDialogVisible">
      <VCard class="mx-auto" width="350px">
        <VCardTitle>{{ t("Confirm Deletion") }}</VCardTitle>
        <VCardText>Are you sure you want to delete this Slider?</VCardText>
        <VCardActions>
          <VBtn @click="deleteSlider" color="error">Delete</VBtn>
          <VBtn @click="deleteSliderDialogVisible = false" color="success">Cancel</VBtn>
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
const newSlider: any = ref({ id: null, img: "" });
const selectedItem: any = ref();
const editSliderTarget: any = ref({
  id: null,
  img: "",
});
const deleteItemTarget: any = ref();
const { t } = useI18n();

const sliders = ref([
  { id: 1, img: "images/pages/5.jpg" },
  { id: 2, img: "images/pages/1.png" },
  { id: 3, img: "images/pages/2.png" },
  { id: 4, img: "images/pages/3.png" },
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
    isSaving.value = true;
    sliders.value.push({
      id: Date.now(),
      img: newSlider.value.img
    });
    newSlider.value.img = "";
    addSliderDialogVisible.value = false;
    isSaving.value = false;
  } else {
    alert("Please select an image to continue.");
  }
};

const saveEditedSlider = () => {
  if (!editSliderTarget.value.img) {
    alert("Please select an image to continue.");
  }
  isSaving.value = true;
  setTimeout(() => {
    const index = sliders.value.findIndex(
      (i) => i.id === editSliderTarget.value.id
    );
    if (index !== -1) {
      sliders.value[index] = { ...editSliderTarget.value };
    }
    editSliderDialogVisible.value = false;
    isSaving.value = false;
  }, 1000);
};

const handleEditedSliderImage = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        editSliderTarget.value.img = reader.result;
      }
    };
    reader.readAsDataURL(file);
  }
}

const handleNewSliderImage = (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      newSlider.value.img = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  else {
    alert("Please select an image to continue.");
  }
};

const showSliderDetails = (item: any) => {
  selectedItem.value = item;
  showSliderDialogVisible.value = true;
};

const deleteSlider = () => {
  sliders.value = sliders.value.filter(
    (i) => i.id !== deleteItemTarget.value.id
  );
  deleteSliderDialogVisible.value = false;
};
</script>
<style>
.card-style {
  width: 440px;
  height: 350px;
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


}

.preview-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 16px;
  align-items: center;
}
</style>

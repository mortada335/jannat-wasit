<template>
  <div>
    <!-- search and filter box -->
    <VCard class="pa-5 mb-3">
      <VRow align="center">
        <VCol cols="12" md="3" sm="4">
          <VTextField v-model="searchQuery" single-line label="Search" clearable @input="filterItems" color="success" />
        </VCol>

        <VCol cols="12" md="3" sm="2">
          <VBtn @click="isFilterMenuOpen = !isFilterMenuOpen" :color="isFilterMenuOpen ? 'success' : 'dark'">
            <VIcon size="x-large" icon="mdi-filter-outline" />
          </VBtn>
        </VCol>
        <VCard>
          <VTabs color="success" v-model="viewMode">
            <v-tab value="list">
              <v-icon size="x-large" icon="mdi-view-list-outline" />
            </v-tab>
            <v-tab value="grid">
              <v-icon size="x-large" icon="mdi-grid-large" />
            </v-tab>
          </VTabs>
        </VCard>

        <VCol cols="12" md="3" sm="3">
          <VBtn color="success" outlined @click="openAddServiceDialog">Add New Service</VBtn>
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
              <VTextField v-model="filterTitle" color="success" label="Title" clearable @input="filterItems" />
            </VCol>
            <VCol cols="12" md="6" sm="6">
              <VTextField v-model="filterSubtitle" color="success" label="Subtitle" clearable @input="filterItems" />
            </VCol>
            <VCol cols="12" md="4" sm="4">
              <VTextField v-model="filterPhoneNumber" color="success" label="Phone Number" clearable
                @input="filterItems" />
            </VCol>
          </VRow>
        </VList>
      </VCard>
    </VExpandTransition>

    <!-- list view -->
    <div v-if="viewMode === 'list'">
      <VTable density="default" min-height="300px">
        <thead>
          <tr>
            <th>Title</th>
            <th class="text-center">Subtitle</th>
            <th>Image</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
      </VTable>
      <VCard v-for="item in paginatedListItems" :key="item.id" @click="showItemDetails(item)">
        <VTable class="pa-2" min-height="300px">
          <tbody>
            <tr class="cursor-pointer">
              <td>
                {{ item.title }}
              </td>
              <td>{{ item.subtitle }}</td>
              <td>
                <img style="width: 100px; height: 50px" alt="img view" :src="item.image" />
              </td>
              <td class="text-center">{{ item.phoneNumber }}</td>
              <td>
                <VRow no-gutters class="text-left">
                  <VCol cols="6">
                    <VBtn @click.stop="openDeleteDialog(item)" variant="plain" color="#eb2224">
                      <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                      <VIcon size="x-large" icon="mdi-trash-can" />
                    </VBtn>
                  </VCol>
                  <VCol cols="2">
                    <VBtn @click.stop="openEditDialog(item)" variant="plain">
                      <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                      <VIcon size="x-large" icon="mdi-square-edit-outline" />
                    </VBtn>
                  </VCol>
                </VRow>
              </td>
            </tr>
          </tbody>
        </VTable>
        <VDivider></VDivider>
      </VCard>
      <VPagination v-model="listCurrentPage" :length="Math.ceil(filteredItems.length / itemsPerPage)" color="primary" />
    </div>

    <!-- grid view -->

    <div v-if="viewMode === 'grid'">
      <VRow>
        <VCol cols="12" md="4" sm="4" class="table-container"
          v-for="item in paginatedGridItems.length ? paginatedGridItems : items" :key="item.id">
          <VCard class="pa-3" @click="showItemDetails(item)">
            <VRow>
              <VCol cols="12">
                <p align="left" class="mb-3">
                  <strong>Title: </strong><span style="
                      background-color: rgb(60, 60, 90);
                      padding: 3px;
                      border-radius: 15%;
                    ">&nbsp;{{ item.title }}</span>
                </p>

                <p align="left" class="mb-3">
                  <strong>Subtitle: </strong><span style="
                      background-color: rgb(60, 60, 90);
                      padding: 3px;
                      border-radius: 15%;
                    ">
                    &nbsp; {{ item.subtitle }}</span>
                </p>
                <p align="left" class="mb-3">
                  <strong>Phone Number: </strong><span style="
                      background-color: rgb(60, 60, 90);
                      padding: 3px;
                      border-radius: 15%;
                    ">&nbsp;{{ item.phoneNumber }}</span>
                </p>
                <p align="left" class="mt-2">
                  <span style="
                      background-color: rgb(60, 60, 90);
                      padding: 2px 8px;
                      margin-left: 1rem;
                      border-radius: 15%;
                    ">&NonBreakingSpace;</span>
                  <strong>:Image</strong>
                </p>
                <VCol align="left" cols="12">
                  <img :src="item.image" style="
                      width: 90px;
                      height: 70px;
                      object-fit: contain;
                      border-radius: 15px;
                    " />
                </VCol>
              </VCol>
            </VRow>
            <VRow justify="end" dense class="flex items-center">
              <VBtn @click.stop="openEditDialog(item)" variant="plain" color="primary">
                <VTooltip activator="parent" location="top">Edit</VTooltip>
                <VIcon size="x-large" icon="mdi-pencil" />
              </VBtn>
              <VBtn @click.stop="openDeleteDialog(item)" variant="plain" color="error">
                <VTooltip activator="parent" location="top">Delete</VTooltip>
                <VIcon size="x-large" icon="mdi-delete" />
              </VBtn>
            </VRow>
          </VCard>
        </VCol>
      </VRow>
      <VPagination v-model="gridCurrentPage" :length="Math.ceil(
        paginatedListItems.length ? paginatedListItems : items.length / itemsPerPage
      )
        " color="primary" />
    </div>

    <!-- add new service dialog -->

    <VDialog v-model="addServiceDialogVisible">
      <VCard class="mx-auto" width="440px">
        <VCardTitle>Add New Service</VCardTitle>
        <VCardText class="text-center">
          <VCol class="text-center" cols="12" lg="12" md="8">
            <VTextField required class="mb-3" label="Title" v-model="newService.title" />
            <VTextField required class="mb-3" label="Subtitle" v-model="newService.subtitle" />
            <VTextField required label="Phone Number" v-model="newService.phoneNumber" />
            <VFileInput required class="mt-3" label="Image" v-model="newService.image" accept="image/*"
              @change="(e: any) => handleImageUpload(e, 'add')" :error-messages="imageError"
              prepend-icon="mdi-camera" />

            <div v-if="newService.imagePreview" class="mt-3">
              <p class="mb-2">Preview</p>
              <img :src="newService.imagePreview" alt="Preview" style="
                  max-width: 200px;
                  max-height: 150px;
                  object-fit: contain;
                  border-radius: 4px;
                " />
            </div>
          </VCol>
        </VCardText>
        <VCardActions>
          <VBtn color="error" @click="addServiceDialogVisible = false">Cancel</VBtn>
          <VBtn color="success" @click="saveNewService">Save</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- show details dialog -->
    <VDialog v-model="detailsDialogVisible">
      <VCard class="mx-auto" width="450px">
        <VCardTitle>Item Details</VCardTitle>
        <VCardText>
          <p>Title: {{ selectedItem.title }}</p>
          <p>Subtitle: {{ selectedItem.subtitle }}</p>
          <p>phoneNumber: {{ selectedItem.phoneNumber }}</p>
          <img :src="selectedItem.image" width="200" />
        </VCardText>
        <VCardActions>
          <VBtn color="primary" @click="detailsDialogVisible = false">Close</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- delete dialog -->
    <VDialog v-model="deleteDialogVisible">
      <VCard class="mx-auto" width="450px">
        <VCardTitle>Confirm Deletion</VCardTitle>
        <VCardText>
          Are you sure you want to delete "{{ deleteItemTarget.title }}"?
        </VCardText>
        <VCardActions>
          <VBtn color="error" text @click="deleteItem(deleteItemTarget)">Delete</VBtn>
          <VBtn text @click="deleteDialogVisible = false">Cancel</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- edit dialog -->
    <VDialog v-model="editDialogVisible">
      <VCard class="mx-auto" width="440px">
        <VCardTitle>Edit Item</VCardTitle>
        <CardText>
          <VCol class="text-center" cols="12" lg="12" md="8">
            <VTextField class="mb-4" label="Title" v-model="editItemTarget.title" required></VTextField>
            <VTextField label="Subtitle" v-model="editItemTarget.subtitle" required></VTextField>
            <VTextField label="Phone Number" class="mt-4" v-model="editItemTarget.phoneNumber" required></VTextField>
            <VFileInput class="mt-3" label="Image" accept="image/*"
              @change="(e: any) => handleImageUpload(e, 'edit')" />
            <div v-if="editItemTarget.image" class="mt-3">
              <img :src="editItemTarget.image" alt="Preview"
                style="max-width: 200px; max-height: 150px; object-fit: contain" />
            </div>
          </VCol>
        </CardText>
        <VCardActions>
          <VBtn color="error" @click="cancelEdit">Cancel</VBtn>
          <VBtn color="success" @click="saveEdit" :loading="isSaving">Save</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <VProgressCircular v-if="isSaving" indeterminate />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";

const searchQuery: any = ref("");
const viewMode: any = ref("list");

const filteredItems: any = ref([]);
const isFilterMenuOpen: any = ref(false);
const filterTitle: any = ref("");
const filterSubtitle: any = ref("");
const filterPhoneNumber: any = ref("");

const selectedItem: any = ref(null);
const deleteItemTarget: any = ref(null);
const editItemTarget: any = ref({
  id: null,
  title: "",
  subtitle: "",
  phoneNumber: "",
  image: "",
});

const detailsDialogVisible: any = ref(false);
const deleteDialogVisible: any = ref(false);
const editDialogVisible: any = ref(false);
const addServiceDialogVisible: any = ref(false);

const imageError = ref("");
const imagePreview: any = ref<string | null>(null);

const generateId = () =>
  items.value.length ? Math.max(...items.value.map((item) => item.id)) + 1 : 1;

const isSaving = ref(false);

const itemsPerPage = ref(5);
const gridCurrentPage = ref(1);
const listCurrentPage = ref(1);

const items = ref([
  {
    id: 1,
    title: "Service 1",
    subtitle: "Subtitle 1",
    phoneNumber: "07721573742",
    image: "images/pages/1.png",
  },
  {
    id: 2,
    title: "Service 2",
    subtitle: "Subtitle 2",
    phoneNumber: "07721573742",
    image: "images/pages/2.png",
  },
  {
    id: 3,
    title: "Service 3",
    subtitle: "Subtitle 3",
    phoneNumber: "07721573742",
    image: "images/pages/3.png",
  },
  {
    id: 4,
    title: "Service 4",
    subtitle: "Subtitle 4",
    phoneNumber: "07721573742",
    image: "images/pages/5.jpg",
  },
  {
    id: 5,
    title: "Service 5",
    subtitle: "Subtitle 5",
    phoneNumber: "07721573742",
    image: "images/pages/6.jpg",
  },
  {
    id: 6,
    title: "Service 6",
    subtitle: "Subtitle 6",
    phoneNumber: "07721573742",
    image: "images/pages/3.png",
  },
  {
    id: 7,
    title: "Service 7",
    subtitle: "Subtitle 7",
    phoneNumber: "07721573742",
    image: "images/pages/1.png",
  },
  {
    id: 8,
    title: "Service 8",
    subtitle: "Subtitle 8",
    phoneNumber: "07721573742",
    image: "images/pages/5.jpg",
  },
]);

const newService: any = ref({
  title: "",
  subtitle: "",
  phoneNumber: "",
  image: "",
  imagePreview: null,
});
const filterItems: any = () => {
  if (!items.value || items.value.length === 0) {
    filteredItems.value = [];
    return;
  }

  filteredItems.value = [...items.value].filter((item) => {
    const matchesSearchQuery =
      !searchQuery.value ||
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.phoneNumber?.toString().includes(searchQuery.value);
    const matchesTitle =
      !filterTitle.value ||
      item.title.toLowerCase().includes(filterTitle.value.toLowerCase());
    const matchesSubtitle =
      !filterSubtitle.value ||
      item.subtitle.toLowerCase().includes(filterSubtitle.value.toLowerCase());
    const matchesPhoneNumber =
      !filterPhoneNumber.value ||
      item.phoneNumber?.toString().includes(filterPhoneNumber.value);
    return matchesSearchQuery && matchesTitle && matchesSubtitle && matchesPhoneNumber;
  });
  gridCurrentPage.value = 1;
  listCurrentPage.value = 1;
};

const paginatedGridItems = computed(() => {
  const sourceItems = filteredItems.value.length ? filteredItems.value : items.value;
  const startIndex = (gridCurrentPage.value - 1) * itemsPerPage.value;

  return sourceItems.slice(startIndex, startIndex + itemsPerPage.value);
});

const paginatedListItems = computed(() => {
  const sourceItems = filteredItems.value.length ? filteredItems.value : items.value;
  const startIndex = (listCurrentPage.value - 1) * itemsPerPage.value;

  return sourceItems.slice(startIndex, startIndex + itemsPerPage.value);
});

const openAddServiceDialog = () => {
  newService.value = { title: "", subtitle: "", phoneNumber: "", image: "" };
  addServiceDialogVisible.value = true;
};

const openDeleteDialog: any = (item: any): any => {
  deleteItemTarget.value = item;
  deleteDialogVisible.value = true;
};

const openEditDialog: any = (item: any): any => {
  editItemTarget.value = { ...item };
  editDialogVisible.value = true;
};
const cancelAddService = () => {
  addServiceDialogVisible.value = false;
  newService.value = {
    title: "",
    subtitle: "",
    phoneNumber: "",
    image: "",
    imagePreview: null,
  };
  imageError.value = "";
};
const cancelEdit = () => {
  editItemTarget.value = {
    id: null,
    title: "",
    subtitle: "",
    phoneNumber: "",
    image: "",
  };
  imageError.value = "";
  editDialogVisible.value = false;
};

const saveNewService = () => {
  imageError.value = "";
  if (
    !newService.value.title?.trim() ||
    !newService.value.subtitle?.trim() ||
    !newService.value.phoneNumber?.trim()
  ) {
    alert("please fill in all fields.");
    return;
  }
  if (!newService.value.image) {
    imageError.value = "please select an image.";
    return;
  }
  const newItem = {
    id: generateId(),
    title: newService.value.title.trim(),
    subtitle: newService.value.subtitle.trim(),
    phoneNumber: newService.value.phoneNumber.trim(),
    image: newService.value.imagePreview,
  };

  items.value = [...items.value, { ...newItem }];

  cancelAddService();

  filterItems();
};

const showItemDetails: any = (item: any): any => {
  selectedItem.value = item;
  detailsDialogVisible.value = true;
};

const saveEdit = () => {
  if (
    !editItemTarget.value.title?.trim() ||
    !editItemTarget.value.subtitle?.trim() ||
    !editItemTarget.value.phoneNumber?.trim()
  ) {
    alert("please fill in all required fields.");
    return;
  }
  isSaving.value = true;

  setTimeout(() => {
    const index = items.value.findIndex((item) => item.id === editItemTarget.value.id);

    if (index !== -1) {
      const updatedItem = {
        ...editItemTarget.value,
        title: editItemTarget.value.title.trim(),
        subtitle: editItemTarget.value.subtitle.trim(),
        phoneNumber: editItemTarget.value.phoneNumber.trim(),
      };
      items.value = [
        ...items.value.slice(0, index),
        updatedItem,
        ...items.value.slice(index + 1),
      ];
      filterItems();
    }

    editDialogVisible.value = false;
    isSaving.value = false;
  }, 1000);
};

const deleteItem: any = (itemToDelete: any): any => {
  items.value = items.value.filter((item) => item.id !== itemToDelete.id);

  deleteItemTarget.valueOf = null;
  deleteDialogVisible.value = false;
  filterItems();
};

const handleImageUpload = (event: Event, mode: "add" | "edit") => {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];
  imageError.value = "";

  if (!file) {
    imageError.value = "please select an image.";
    if (mode === "add") {
      newService.value.imagePreview = null;
    } else {
      editItemTarget.value = "";
    }

    return;
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    imageError.value = "Image size should be less than 5MB.";
    fileInput.value = "";
    if (mode === "add") {
      newService.value.imagePreview = null;
    } else {
      editItemTarget.value.image = "";
    }
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    const imageResult = e.target?.result as string;
    if (mode === "add") {
      newService.value.imagePreview = imageResult;
      newService.value.image = file;
    } else {
      editItemTarget.value.image = imageResult;
    }
  };
  reader.onerror = () => {
    imageError.value = "error reading file";
    if (mode === "add") {
      imagePreview.value = null;
    } else {
      editItemTarget.value.image = "";
    }
  };

  reader.readAsDataURL(file);
};
watch([filterTitle, filterSubtitle, filterPhoneNumber, searchQuery], () => {
  gridCurrentPage.value = 1;
  listCurrentPage.value = 1;
});

const resetFilters: any = (): any => {
  searchQuery.value = "";
  filterTitle.value = "";
  filterSubtitle.value = "";
  filterPhoneNumber.value = "";
  filterItems();
};
</script>

<style scoped>
.preview-image {
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 5px;
  margin-top: 10px;
}
</style>

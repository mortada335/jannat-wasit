<template>
  <div>
    <!-- search and filter box -->
    <VCard class="pa-5 mb-3">
      <VRow align="center">
        <VCol cols="12" md="3" sm="3">
          <VTextField v-model="searchQuery" single-line label="Search" clearable @input="filterItems" color="success" />
        </VCol>

        <VCol cols="12" md="2" sm="2">
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
          <VBtn color="success" @click="openAddNewProjectDialog">Add New Project</VBtn>
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
            <VCol cols="12" md="3" sm="3">
              <VTextField v-model="filterTitle" color="success" label="Title" clearable @input="filterItems" />
            </VCol>
            <VCol cols="12" md="3" sm="3">
              <VTextField v-model="filterSubtitle" color="success" label="Subtitle" clearable @input="filterItems" />
            </VCol>
            <VCol cols="12" md="3" sm="3">
              <VTextField v-model="filterPhoneNumber" color="success" label="Phone Number" clearable
                @input="filterItems" />
            </VCol>
            <VCol cols="12" md="3" sm="3">
              <VTextField v-model="filterDate" color="success" label="Date" clearable @input="filterItems" />
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
            <th>Date</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
      </VTable>

      <VCard v-for="item in paginatedListItems" :key="item.id" @click="showItemDetails(item)">
        <VTable class="pa-2" min-height="300px">
          <tbody>
            <tr>
              <td>
                {{ item.title }}
              </td>
              <td>{{ item.subtitle }}</td>
              <td>
                <img style="width: 100px; height: 50px" loading="lazy" alt="img view" :src="item.image" />
              </td>
              <td>
                {{ item.date }}
              </td>
              <td>{{ item.phoneNumber }}</td>
              <td>
                <VRow no-gutters class="text-left">
                  <VCol cols="6">
                    <VBtn @click.stop="openDeleteDialog(item)" variant="plain" color="#eb2224">
                      <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                      <VIcon size="x-large" icon="mdi-trash-can" />
                    </VBtn>
                  </VCol>
                  <VCol cols="2">
                    <VBtn variant="plain" @click.stop="openEditDialog(item)">
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
      <VPagination v-model="listCurrentPage" :length="totalListPages" :total-visible="5" />
    </div>

    <!-- grid view -->
    <div v-if="viewMode === 'grid'">
      <VRow>
        <VCol cols="12" md="4" sm="4" class="" v-for="item in paginatedGridItems.length ? paginatedGridItems : items"
          :key="item.id">
          <VCard class="pa-2" @click="showItemDetails(item)">
            <VRow>
              <VCol cols="12">
                <div class="pa-3">
                  <p align="left" class="mb-5">
                    <strong>Title: </strong><span style="
                        background-color: rgb(60, 60, 90);
                        padding: 3px;
                        border-radius: 15%;
                      ">{{ item.title }}</span>
                  </p>
                  <p align="left" class="mb-5">
                    <strong>Subtitle: </strong><span style="
                        background-color: rgb(60, 60, 90);
                        padding: 3px;
                        border-radius: 15%;
                      ">{{ item.subtitle }}</span>
                  </p>
                  <p align="left" class="mb-5">
                    <strong>Phone Number: </strong>
                    <span style="
                        background-color: rgb(60, 60, 90);
                        padding: 3px;
                        border-radius: 15%;
                      ">{{ item.phoneNumber }}</span>
                  </p>
                  <p align="left ">
                    <strong>Date: </strong><span style="
                        background-color: rgb(60, 60, 90);
                        padding: 3px;
                        border-radius: 15%;
                      ">{{ item.date }}</span>
                  </p>
                </div>
              </VCol>
            </VRow>
            <VRow dense>
              <VCol cols="12" align="left">
                <VBtn @click.stop="openEditDialog(item)" variant="plain" color="primary">
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
      <VPagination v-model="gridCurrentPage" :length="totalGridPages" :total-visible="5" />
    </div>

    <!-- add new project dialog -->

    <VDialog v-model="addProjectDialogVisible">
      <VCard class="mx-auto" width="440px">
        <VCardTitle>Add New Project</VCardTitle>
        <VCardText class="text-center">
          <VCol class="text-center" cols="12" lg="12" md="8">
            <VTextField required class="mb-3" label="title" v-model="newProject.title" />
            <VTextField required class="mb-3" label="subtitle" v-model="newProject.subtitle" />
            <VTextField required label="phone number" v-model="newProject.phoneNumber" />
            <VTextField required class="mt-3" label="Date" v-model="newProject.date" />
            <VFileInput required class="mt-3" label="Image" @change="(e: any) => handleImageUpload(e, 'add')"
              v-model="newProject.image" accept="image/*" />

            <div v-if="newProject.imagePreview" class="mt-3">
              <p class="mb-2">Preview</p>
              <img :src="newProject.imagePreview" alt="Preview" style="
                  max-width: 200px;
                  max-height: 150px;
                  object-fit: contain;
                  border-radius: 4px;
                " />
            </div>
          </VCol>
        </VCardText>
        <VCardActions>
          <VBtn color="error" @click="cancelAddProject">Cancel</VBtn>
          <VBtn color="success" @click="saveNewProject">Save</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- show details dialog -->
    <VDialog v-model="detailsDialogVisible">
      <VCard class="pa-2 mx-auto" width="450px">
        <VCardTitle>Item Details</VCardTitle>
        <VCardText>
          <p class="mb-2">Title: {{ selectedItem.title }}</p>
          <p class="mb-2">Subtitle: {{ selectedItem.subtitle }}</p>
          <p class="mb-2">Phone Number: {{ selectedItem.phoneNumber }}</p>
          <p class="mb-2">Date: {{ selectedItem.date }}</p>
          <img alt="image view" style="width: 200px; height: 150px" :src="selectedItem.image" />
        </VCardText>
        <VCardActions>
          <VBtn @click="detailsDialogVisible = false">Close</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- delete dialog -->
    <VDialog v-model="deleteDialogVisible">
      <VCard class="mx-auto" width="450px">
        <VCardTitle>t(Confirm Deletion)</VCardTitle>
        <VCardText class="text-left">
          ? Are you sure you want to delete this Project
        </VCardText>
        <VCardActions>
          <VBtn color="error" text @click="deleteItem(deleteItemTarget)">Delete</VBtn>
          <VBtn @click="deleteDialogVisible = false">Cancel</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- edit dialog -->
    <VDialog v-model="editDialogVisible">
      <VCard class="mx-auto" width="440px">
        <VCardTitle>Edit Project</VCardTitle>
        <VCardText>
          <VTextField class="mb-4" label="Title" required v-model="editItemTarget.title" />
          <VTextField label="Subtitle" v-model="editItemTarget.subtitle"></VTextField>
          <VTextField required label="Phone Number" class="mt-4" v-model="editItemTarget.phoneNumber" />
          <VTextField required label="Date" class="mt-4" v-model="editItemTarget.date" />
          <VFileInput class="mt-4" label="Image" @change="(e: any) => handleImageUpload(e, 'edit')" accept="image/*" />
          <div v-if="editItemTarget.image" class="mt-3">
            <img :src="editItemTarget.image" alt="Preview"
              style="max-width: 200px; max-height: 150px; object-fit: contain" />
          </div>
        </VCardText>
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

const isFilterMenuOpen: any = ref(false);
const filteredItems: any = ref([]);
const filterTitle: any = ref("");
const filterSubtitle: any = ref("");
const filterPhoneNumber: any = ref("");
const filterDate: any = ref("");

const selectedItem: any = ref(null);
const deleteItemTarget: any = ref(null);
const editItemTarget: any = ref({
  id: null,
  title: "",
  subtitle: "",
  phoneNumber: "",
  date: "",
  image: "",
});

const detailsDialogVisible: any = ref(false);
const deleteDialogVisible: any = ref(false);
const editDialogVisible: any = ref(false);
const addProjectDialogVisible = ref(false);

const isSaving = ref(false);

const totalListPages = computed(() =>
  Math.ceil(filteredItems.value.length / itemsPerPage.value)
);
const totalGridPages = computed(() =>
  Math.ceil(filteredItems.value.length / itemsPerPage.value)
);

const itemsPerPage = ref(5);
const gridCurrentPage = ref(1);
const listCurrentPage = ref(1);

const imageError = ref("");
const imagePreview = ref<string | null>(null);

const items = ref([
  {
    id: 1,
    title: "Service 1",
    subtitle: "Subtitle 1",
    phoneNumber: "07721573742",
    image: "images/pages/1.png",
    date: "07/11/2024",
  },
  {
    id: 2,
    title: "Service 2",
    subtitle: "Subtitle 2",
    phoneNumber: "07721573742",
    image: "images/pages/2.png",
    date: "07/11/2024",
  },
  {
    id: 3,
    title: "Service 3",
    subtitle: "Subtitle 3",
    phoneNumber: "07721573742",
    image: "images/pages/3.png",
    date: "07/11/2024",
  },
  {
    id: 4,
    title: "Service 4",
    subtitle: "Subtitle 4",
    phoneNumber: "07721573742",
    image: "images/pages/5.jpg",
    date: "07/11/2024",
  },
  {
    id: 5,
    title: "Service 5",
    subtitle: "Subtitle 5",
    phoneNumber: "07721573742",
    image: "images/pages/6.jpg",
    date: "07/01/2024",
  },
  {
    id: 6,
    title: "Service 6",
    subtitle: "Subtitle 6",
    phoneNumber: "07721573742",
    image: "images/pages/3.png",
    date: "01/11/2024",
  },
  {
    id: 7,
    title: "Service 7",
    subtitle: "Subtitle 7",
    phoneNumber: "07721573742",
    image: "images/pages/1.png",
    date: "07/11/2024",
  },
  {
    id: 8,
    title: "Service 8",
    subtitle: "Subtitle 8",
    phoneNumber: "07721573742",
    image: "images/pages/2.png",
    date: "07/11/2024",
  },
]);


const saveEdit = () => {
  isSaving.value = true;
  if (
    !editItemTarget.value.title?.trim() ||
    !editItemTarget.value.subtitle?.trim() ||
    !editItemTarget.value.phoneNumber?.trim() ||
    !editItemTarget.value.date?.trim()
  ) {
    alert("Please fill in all required fields.");
    return;
  }
  setTimeout(() => {
    const index = items.value.findIndex((item) => item.id === editItemTarget.value.id);
    if (index !== -1) {
      // items.value[index] = { ...editItemTarget.value }
      const updatedItem = {
        ...items.value[index],
        title: editItemTarget.value.title.trim(),
        subtitle: editItemTarget.value.subtitle.trim(),
        phoneNumber: editItemTarget.value.phoneNumber.trim(),
        date: editItemTarget.value.date.trim(),
        image: editItemTarget.value.image, // Make sure to include the image
      };

      // Update the item in the array
      items.value[index] = updatedItem;

      // Trigger reactivity
      items.value = [...items.value];

      // Re-filter and update pagination
      filterItems();


    }
    cancelEdit();
    // editDialogVisible.value = false;
    isSaving.value = false;
  }, 1000);
};
const newProject: any = ref({
  title: "",
  subtitle: "",
  phoneNumber: "",
  image: "",
  date: "",
  imagePreview: null,
});
const filterItems = () => {
  if (!items.value || items.value.length === 0) {
    filteredItems.value = [];
    return filterItems();
  }

  filteredItems.value = items.value.filter((item) => {
    const matchesSearchQuery =
      !searchQuery.value ||
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.phoneNumber?.toString().includes(searchQuery.value) ||
      item.date.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesTitle =
      !filterTitle.value ||
      item.title.toLowerCase().includes(filterTitle.value.toLowerCase());
    const matchesSubtitle =
      !filterSubtitle.value ||
      item.subtitle.toLowerCase().includes(filterSubtitle.value.toLowerCase());
    const matchesPhoneNumber =
      !filterPhoneNumber.value ||
      item.phoneNumber?.toString().includes(filterPhoneNumber.value);
    const matchesDate =
      !filterDate.value ||
      item.date.toLowerCase().includes(filterDate.value.toLowerCase());

    return (
      matchesSearchQuery &&
      matchesTitle &&
      matchesSubtitle &&
      matchesPhoneNumber &&
      matchesDate
    );
  });

  console.log("Filtered Items:", filteredItems.value);
};

const paginatedGridItems = computed(() => {
  const startIndex = (gridCurrentPage.value - 1) * itemsPerPage.value;
  return filteredItems.value.slice(startIndex, startIndex + itemsPerPage.value);
});

onMounted(() => {
  filterItems();
});

const paginatedListItems = computed(() => {
  const startIndex = (listCurrentPage.value - 1) * itemsPerPage.value;

  return filteredItems.value.slice(startIndex, startIndex + itemsPerPage.value);
});
const openAddNewProjectDialog = () => {
  addProjectDialogVisible.value = true;
};
const generateId = () =>
  items.value.length ? Math.max(...items.value.map((item) => item.id)) + 1 : 1;

const cancelAddProject = () => {
  addProjectDialogVisible.value = false;
  newProject.value = {
    title: "",
    subtitle: "",
    phoneNumber: "",
    image: "",
    date: "",
    imagePreview: null,
  };
  imageError.value = "";
};

const cancelEdit = () => {
  editDialogVisible.value = false;
  editItemTarget.value = {
    id: null,
    title: "",
    subtitle: "",
    phoneNumber: "",
    date: "",
    image: "",
  };
};

const saveNewProject = () => {
  if (
    !newProject.value.title?.trim() ||
    !newProject.value.subtitle?.trim() ||
    !newProject.value.phoneNumber?.trim() ||
    !newProject.value.date?.trim()
  ) {
    alert("please fill in all fields to continue.");
  }
  if (!newProject.value.image) {
    imageError.value = "Please select an image.";
    return;
  }
  const newItem = {
    id: generateId(),
    title: newProject.value.title?.trim(),
    subtitle: newProject.value.subtitle?.trim(),
    phoneNumber: newProject.value.phoneNumber?.trim(),
    image: newProject.value.imagePreview,
    date: newProject.value.date?.trim(),
  };
  items.value = [...items.value, { ...newItem }];
  cancelAddProject();

  filterItems();
};

const showItemDetails = (item: any) => {
  selectedItem.value = item;
  detailsDialogVisible.value = true;
};

const openDeleteDialog = (item: any) => {
  deleteItemTarget.value = item;
  deleteDialogVisible.value = true;
};

const openEditDialog = (item: any) => {
  console.log("opening edit dialog", item);

  editItemTarget.value = { ...item };
  editDialogVisible.value = true;
}

const deleteItem = (itemToDelete: any) => {
  items.value = items.value.filter((item) => item.id !== itemToDelete.id);

  deleteItemTarget.valueOf = null;
  deleteDialogVisible.value = false;
  filterItems();
};

watch(
  [filterTitle, filterSubtitle, filterPhoneNumber, filterDate, searchQuery],
  () => {
    filterItems();
    gridCurrentPage.value = 1;
    listCurrentPage.value = 1;
  },
  { immediate: true }
);

const resetFilters: any = (): any => {
  searchQuery.value = "";
  filterTitle.value = "";
  filterSubtitle.value = "";
  filterPhoneNumber.value = "";
  filterDate.value = "";
  filterItems();
};

const handleImageUpload = (event: Event, mode: "add" | "edit") => {
  const fileInput = event.target as HTMLInputElement;
  const file = fileInput.files?.[0];
  imageError.value = "";

  if (!file) {
    imageError.value = "please select an image.";
    if (mode === "add") {
      newProject.value.imagePreview = null;
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
      newProject.value.imagePreview = null;
    } else {
      editItemTarget.value.image = "";
    }
    return;
  }

  const reader = new FileReader();

  reader.onload = (e) => {
    const imageResult = e.target?.result as string;
    if (mode === "add") {
      newProject.value.imagePreview = imageResult;
      newProject.value.image = file;
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
</script>

<style scoped></style>

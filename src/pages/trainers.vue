<template>
  <div>
    <!-- search and filter box -->
    <VCard class="pa-5 mb-3 flex flex-row">
      <VRow align="center">
        <VCol cols="12" md="6" sm="6">
          <VTextField
            v-model="searchQuery"
            single-line
            label="Search"
            clearable
            @input="filterItems"
            color="success"
          />
        </VCol>

        <VCol cols="12" md="2" sm="2">
          <VBtn
            @click="isFilterMenuOpen = !isFilterMenuOpen"
            :color="isFilterMenuOpen ? 'success' : 'dark'"
          >
            <VIcon size="x-large" icon="mdi-filter-outline" />
          </VBtn>
        </VCol>

        <VCol cols="12" md="4" sm="4" class="flex items-center">
          <VBtnToggle v-model="viewMode" mandatory>
            <VBtn :value="'list'" color="dark" @click="setView('list')">
              <VIcon size="large" icon="mdi-grid-large" />
            </VBtn>
            <VBtn :value="'grid'" color="dark" @click="setView('grid')">
              <VIcon size="large" icon="mdi-view-grid-outline" />
            </VBtn>
          </VBtnToggle>
        </VCol>
        <VCol cols="12" md="5" class="flex items-center">
          <VBtn
            v-show="$vuetify.display.mdAndUp"
            color="primary"
            outlined
            @click="openAddServiceDialog"
            >Add New Service</VBtn
          ></VCol
        >
      </VRow>
    </VCard>

<!-- filters transition -->
    <VExpandTransition>
      <VCard v-show="isFilterMenuOpen" class="my-2 pa-2">
        <VList dense>
          <VListItemTitle>
            <span class="text-xl px-4">Filters</span>
            <VBtn color="success" @click="resetFilters">
              <VIcon size="x-large" icon="mdi-restore" />
            </VBtn>
          </VListItemTitle>
          <VRow class="ma-1">
            <VCol cols="12" md="6" sm="6">
              <VTextField
                v-model="filterTitle"
                color="success"
                label="Title"
                clearable
                @input="filterItems"
              />
            </VCol>
            <VCol cols="12" md="6" sm="6">
              <VTextField
                v-model="filterSubtitle"
                color="success"
                label="Subtitle"
                clearable
                @input="filterItems"
              />
            </VCol>
            <VCol cols="12" md="6" sm="6">
              <VTextField
                v-model="filterPhoneNumber"
                color="success"
                label="Phone Number"
                clearable
                @input="filterItems"
              />
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
            <th class="text-center" >Image</th>
            <th>Phone Number</th>
            <th >Actions</th>
          </tr>
        </thead>
      </VTable>
      <VCard 
        v-for="item in paginatedListItems.length ? paginatedListItems : items"
        :key="item.id"
        @click="showItemDetails(item)"
      >
        <VTable class="pa-2"  min-height="300px">
          <tbody>
            <tr class="cursor-pointer">
              <td>
                {{ item.title }}
              </td>
              <td >{{ item.subtitle }}</td>
            <td width="100px" >
                <VImg :src="item.image" />
              </td>
              <td class="text-center">{{ item.phoneNumber }}</td>
              <td>
                <VRow no-gutters class="text-left">
                  <VCol cols="6">
                    <VBtn
                      @click.stop="openDeleteDialog(item)"
                      variant="plain"
                      color="#eb2224"
                    >
                      <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                      <VIcon size="x-large" icon="mdi-trash-can" />
                    </VBtn>
                  </VCol>
                  <VCol cols="2"
                    ><VBtn @click.stop="openEditDialog(item)" variant="plain">
                      <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                      <VIcon size="x-large" icon="mdi-square-edit-outline" /> </VBtn
                  ></VCol>
                </VRow>
              </td>
            </tr>
          </tbody>
        </VTable>
        <VDivider></VDivider>
      </VCard>
      <VPagination
        v-model="listCurrentPage"
        :length="Math.ceil(filteredItems.length / itemsPerPage)"
        color="primary"
      />
    </div>

    <!-- grid view -->
    
    <div v-if="viewMode === 'grid'">
    <VRow>
    <VCol cols="12" md="4" sm="4" class="" v-for="item in paginatedGridItems.length ? paginatedGridItems : items"
        :key="item.id">  
        <VCard
        class="pa-3 service-card"
        @click="showItemDetails(item)"
      
      >
        <VRow>
          <VCol cols="12">
            <div class="service-info">
              <p align="left"><strong>Title: </strong>{{ item.title }}</p>
              <p align="left" ><strong>Subtitle: </strong>{{ item.subtitle }}</p>
              <p align="left"><strong>Phone Number: </strong>{{ item.phoneNumber }}</p>
              <p align="left"><strong> :Image</strong></p>
                <VCol cols="6" class="image-container">
            <VImg :src="item.image" class="service-image" />
          </VCol>
            </div>
          </VCol>
        
        </VRow>
        <VRow justify="start" dense class="actions-row">
          <VBtn @click.stop="openEditDialog(item)" variant="plain" color="primary">
            <VTooltip activator="parent" location="top">Edit</VTooltip>
            <VIcon icon="mdi-pencil" />
          </VBtn>
          <VBtn @click.stop="openDeleteDialog(item)" variant="plain" color="error">
            <VTooltip activator="parent" location="top">Delete</VTooltip>
            <VIcon icon="mdi-delete" />
          </VBtn>
        </VRow>
      </VCard>
      </VCol>
    
    </VRow>
      <VPagination
        v-model="listCurrentPage"
        :length="Math.ceil(filteredItems.length / itemsPerPage)"
        color="primary"
      />
    
    </div>
    
    <!-- add new service dialog -->

    <VDialog v-model="addServiceDialogVisible">
      <VCard class="mx-auto" width="440px">
        <VCardTitle>Add New Service</VCardTitle>
        <VCardText class="text-center">
          <VCol class="text-center" cols="12" lg="12" md="8">
            <VTextField required class="mb-3" label="title" v-model="newService.title" />
            <VTextField
              required
              class="mb-3"
              label="subtitle"
              v-model="newService.subtitle"
            />
            <VTextField required label="phone number" v-model="newService.phoneNumber" />
            <VTextField required class="mt-3" label="Image" v-model="newService.image" />
          </VCol>
        </VCardText>
        <VCardActions>
          <VBtn color="error" @click="addServiceDialogVisible = false">Cancel</VBtn>
          <VBtn color="primary" @click="saveNewService">Save</VBtn>
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
          <VImg :src="selectedItem.image" width="200" />
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
        <VCardText>
          <VTextField
            class="mb-4"
            label="Title"
            v-model="editItemTarget.title"
          ></VTextField>
          <VTextField label="Subtitle" v-model="editItemTarget.subtitle"></VTextField>
          <VTextField
            label="Phone Number"
            class="mt-4"
            v-model="editItemTarget.phoneNumber"
          ></VTextField>
        </VCardText>
        <VCardActions>
          <VBtn color="error" @click="editDialogVisible = false">Cancel</VBtn>
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
const isFilterMenuOpen: any = ref(false);
const viewMode: any = ref("list");
const filteredItems: any = ref([]);

const filterTitle: any = ref("");
const filterSubtitle: any = ref("");
const filterPhoneNumber: any = ref("");

const selectedItem: any = ref(null);
const deleteItemTarget: any = ref(null);
const editItemTarget: any = ref({});

const detailsDialogVisible: any = ref(false);
const deleteDialogVisible: any = ref(false);
const editDialogVisible: any = ref(false);
const addServiceDialogVisible = ref(false);

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
    image: "/src/assets/images/pages/1.png",
  },                                             
  {
    id: 2,
    title: "Service 2",
    subtitle: "Subtitle 2",
    phoneNumber: "07721573742",
    image: "/src/assets/images/pages/2.png",
  },
  {
    id: 3,
    title: "Service 2",
    subtitle: "Subtitle 2",
    phoneNumber: "07721573742",
    image: "/src/assets/images/pages/3.png",
  },
  {
    id: 4,
    title: "Service 2",
    subtitle: "Subtitle 2",
    phoneNumber: "07721573742",
    image: "/src/assets/images/pages/3.png",
  },
  {
    id: 5,
    title: "Service 2",
    subtitle: "Subtitle 2",
    phoneNumber: "07721573742",
    image: "/src/assets/images/pages/2.png",
  },
  {
    id: 6,
    title: "Service 2",
    subtitle: "Subtitle 2",
    phoneNumber: "07721573742",
    image: "/src/assets/images/pages/2.png",
  },
  {
    id: 7,
    title: "Service 2",
    subtitle: "Subtitle 2",
    phoneNumber: "07721573742",
    image: "/src/assets/images/pages/3.png",
  },
  {
    id: 8,
    title: "Service 2",
    subtitle: "Subtitle 2",
    phoneNumber: "07721573742",
    image: "/src/assets/images/pages/1.png",
  },
]);

const newService: any = ref({
  title: "",
  subtitle: "",
  phoneNumber: "",
  image: "",
});

const paginatedGridItems = computed(() => {
  const startIndex = (gridCurrentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredItems.value.slice(startIndex, endIndex);
});

const paginatedListItems = computed(() => {
  const startIndex = (listCurrentPage.value - 1) * itemsPerPage.value;
  const endIndex = startIndex + itemsPerPage.value;
  return filteredItems.value.slice(startIndex, endIndex);
});

const openAddServiceDialog = () => {
  addServiceDialogVisible.value = true;
};

const saveNewService = (): any => {
  if (
    newService.value.title &&
    newService.value.subtitle &&
    newService.value.image &&
    newService.value.phoneNumber
  ) {
    items.value = [...items.value, { ...newService.value, id: Date.now() }];
    newService.value = { title: "", subtitle: "", phoneNumber: "", image: "" };
    addServiceDialogVisible.value = false;
    filterItems();
  } else {
    alert("please fill in full form to continue.");
  }
};

const filterItems: any = (): any => {
  if (!items.value || items.value.length === 0) {
    filteredItems.value = [];
    return;
  }

  filteredItems.value = items.value.filter((item) => {
    // Check if the item matches the search query in any of the fields
    const matchesSearchQuery =
      !searchQuery.value ||
      item.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      item.phoneNumber?.toString().includes(searchQuery.value);

    // Check if the item matches each specific filter field
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

  console.log("Filtered Items:", filteredItems.value);
};
const showItemDetails: any = (item: any): any => {
  selectedItem.value = item;
  detailsDialogVisible.value = true;
};

const openDeleteDialog: any = (item: any): any => {
  deleteItemTarget.value = item;
  deleteDialogVisible.value = true;
};

const openEditDialog: any = (item: any): any => {
  editItemTarget.value = { ...item };
  editDialogVisible.value = true;
};

const setView: any = (view: any): any => {
  viewMode.value = view;
};

const deleteItem: any = (itemToDelete: any): any => {
  items.value = items.value.filter((item) => item.id !== itemToDelete.id);

  deleteItemTarget.valueOf = null;
  deleteDialogVisible.value = false;
};

const saveEdit = () => {
  isSaving.value = true;
  setTimeout(() => {
    const index = items.value.findIndex((i) => i.id === editItemTarget.value.id);
    if (index !== -1) {
      items.value[index] = { ...editItemTarget.value };

      items.value = [...items.value];
    }

    editDialogVisible.value = false;
    isSaving.value = false;
  }, 1000);
};
watch(items, () => {
  filterItems();
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
.service-card {
  border-radius: 10px;

  margin-bottom: 16px;
  margin-top: 16px;
  color: #cfd8dc;
  cursor: pointer;
}

.service-info p {
  margin: 4px 0;
}

.image-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.service-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.actions-row {
  display: flex;
  gap: 8px;
  align-items: center;
  justify-content: flex-end;
}
</style>

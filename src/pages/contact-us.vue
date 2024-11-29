<template>
  <div>
    <!-- search box -->
    <VCard class="pa-5 mb-3">
      <VRow align="center">
        <VCol cols="12" md="3" sm="3">
          <VTextField v-model="searchQuery" clearable single-line label="Search For Contact" @input="filterContacts"
            color="success" />
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
          <VBtn color="success" @click="openAddnewContactDialog">Add New Contact</VBtn>
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
              <VTextField color="success" required v-model="filterName" label="Title" clearable
                @input="filterContacts" />
            </VCol>
            <VCol cols="12" md="6" sm="6">
              <VTextField color="success" required v-model="filterEmail" label="Date" clearable
                @input="filterContacts" />
            </VCol>
            <VCol cols="12" md="6" sm="6">
              <VTextField color="success" required v-model="filterMessage" label="Date" clearable
                @input="filterContacts" />
            </VCol>
            <VCol cols="12" md="6" sm="6">
              <VTextField color="success" required v-model="filterLocation" label="Date" clearable
                @input="filterContacts" />
            </VCol>
            <VCol cols="12" md="12" sm="6">
              <VTextField color="success" required v-model="filterPhoneNumber" label="Date" clearable
                @input="filterContacts" />
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
            <th width="15%">Name</th>
            <th width="12%">Email</th>
            <th width="13%" class="text-left">Message</th>
            <th width="15%" class="text-center">Location</th>
            <th width="15%">Phone Number</th>
            <th width="15%">Actions</th>
          </tr>
        </thead>
      </VTable>
      <VCard v-for="contact in paginatedListContacts" :key="contact.id" @click="showContactDetails(contact)">
        <VTable class="pa-2" min-height="300px">
          <tbody>
            <tr>
              <td width="12%">{{ contact.name }}</td>
              <td width="12%">{{ contact.email }}</td>
              <td width="13%">{{ contact.message }}</td>
              <td width="15%" class="text-right">{{ contact.location }}</td>
              <td width="15%" class="text-center">{{ contact.phoneNumber }}</td>
              <td width="15%">
                <VBtn color="error" variant="plain" @click.stop="openDeleteDialog(contact)">
                  <v-tooltip activator="parent" location="top">Delete</v-tooltip>
                  <VIcon size="x-large" icon="mdi-trash-can" />
                </VBtn>
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
        <VCol cols="12" sm="4" md="4" v-for="contact in paginatedGridContacts.length ? paginatedGridContacts : contacts"
          :key="contact.id">
          <VCard class="pa-2" @click="showContactDetails(contact)">
            <VRow>
              <VCol cols="12">
                <div class="pa-3">
                  <p align="left" class="mb-5">
                    <strong>Name: </strong> <span
                      style=" background-color:rgb(60, 60, 90); padding:3px; border-radius: 15%;">{{
                        contact.name }}</span>
                  </p>
                  <p align="left" class="mb-5">
                    <strong>Email: </strong> <span
                      style=" background-color:rgb(60, 60, 90);  padding:3px; border-radius: 15%;">{{
                        contact.email }}</span>
                  </p>
                  <p align="left" class="mb-5">
                    <strong>Message: </strong> <span
                      style=" background-color:rgb(60, 60, 90);  padding:3px; border-radius: 15%;">{{
                        contact.message }}</span>
                  </p>
                  <p align="left" class="mb-5">
                    <strong>Location: </strong> <span
                      style=" background-color:rgb(60, 60, 90);  padding:3px; border-radius: 15%;">{{
                        contact.location }}</span>
                  </p>
                  <p align="left" class="">
                    <strong>Phone Number: </strong> <span
                      style=" background-color:rgb(60, 60, 90);  padding:3px; border-radius: 15%;">{{
                        contact.phoneNumber }}</span>
                  </p>
                </div>
              </VCol>
            </VRow>
            <VRow dense>

              <VCol cols="4" md="4" sm="4" align="right" class="mr-1 pa-2">Actions:</VCol>
              <VCol cols="12" md="3" sm="6" align="left">
                <VBtn @click.stop="openDeleteDialog(contact)" variant="plain" color="dark">
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

    <!-- add new contact dialog -->
    <VDialog v-model="addDialogVisible" persistent>
      <VCard class="mx-auto" width="440px">
        <VCardTitle align="left">Add New Contact</VCardTitle>
        <VCardText align="left" class="text-center">
          <VCol align="left" cols="12 " lg="12" md="8" class="text-center">
            <VTextField v-model="newContact.name" required label="Name" />
          </VCol>
          <VCol align="left" cols="12 " lg="12" md="8" class="text-center">
            <VTextField v-model="newContact.email" required label="Email" />
          </VCol>
          <VCol align="left" cols="12 " lg="12" md="8" class="text-center">
            <VTextField v-model="newContact.message" required label="Message" />
          </VCol>
          <VCol align="left" cols="12 " lg="12" md="8" class="text-center">
            <VTextField v-model="newContact.location" required label="Location" />
          </VCol>
          <VCol align="left" cols="12 " lg="12" md="8" class="text-center">
            <VTextField v-model="newContact.phoneNumber" required label="Phone Number" />
          </VCol>
        </VCardText>
        <VCardActions>
          <VBtn color="error" @click="cancelAddContact">Cancel</VBtn>
          <VBtn @click="saveNewContact" color="success">Save</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- show  details dialog -->
    <VDialog v-model="detailsDialogVisible">
      <VCard width="450px" class="mx-auto pa-3">
        <VCardTitle>Contact Details</VCardTitle>
        <VCardText>
          <p class="mb-2"><strong>Name: </strong> {{ selectedContact.name }}</p>
          <p class="mb-2"><strong>Email: </strong>{{ selectedContact.email }}</p>
          <p class="mb-2"><strong>Message: </strong>{{ selectedContact.message }}</p>
          <p class="mb-2"><strong>Location: </strong>{{ selectedContact.location }}</p>
          <p class="mb-2"><strong>Phone Number: </strong>{{ selectedContact.phoneNumber }}</p>
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
        <VCardText>? Are you sure you want to delete this Contact </VCardText>
        <VCardActions>
          <VBtn @click="deleteContact(deleteContactTarget)" color="error">Delete</VBtn>
          <VBtn @click="deleteDialogVisible = false">Cancel</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>


    <VProgressCircular v-if="isSaving" intermediate />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed, onMounted } from 'vue';

const viewMode: any = ref('list')
const searchQuery: any = ref("")

const contacts = ref([
  { id: 1, name: "Contact 1", email: "example1@email.com", message: "message 1", location: "location 1", phoneNumber: "0747683" },
  { id: 2, name: "Contact 2", email: "example2@email.com", message: "message 2", location: "location 2", phoneNumber: "07476538" },
  { id: 3, name: "Contact 3", email: "example3@email.com", message: "message 3", location: "location 3", phoneNumber: "0747627433" },
  { id: 4, name: "Contact 4", email: "example4@email.com", message: "message 4", location: "location 4", phoneNumber: "063728483" },
  { id: 5, name: "Contact 5", email: "example5@email.com", message: "message 5", location: "location 5", phoneNumber: "0757939283" },
  { id: 6, name: "Contact 6", email: "example6@email.com", message: "message 6", location: "location 6", phoneNumber: "07457823" },
  { id: 7, name: "Contact 7", email: "example7@email.com", message: "message 7", location: "location 7", phoneNumber: "088934783" },
  { id: 8, name: "Contact 8", email: "example8@email.com", message: "message 8", location: "location 8", phoneNumber: "074236713" },
])


const newContact: any = ref({
  name: "", email: "", message: "", location: "", phoneNumber: "",
})

const detailsDialogVisible: any = ref(false)
const deleteDialogVisible: any = ref(false)
const addDialogVisible: any = ref(false)

const isSaving = ref(false)

const isFilterMenuOpen = ref(false)
const filteredContacts: any = ref([])

const filterName = ref("")
const filterEmail = ref("")
const filterMessage = ref("")
const filterLocation = ref("")
const filterPhoneNumber = ref("")


const selectedContact: any = ref(null)
const deleteContactTarget: any = ref(null)


const contactsPerPage: any = ref(5)
const gridCurrentPage: any = ref(1)
const listCurrentPage: any = ref(1)

const totalGridPages = computed(() =>
  Math.ceil(filteredContacts.value.length / contactsPerPage.value)
)

const totalListPages = computed(() =>
  Math.ceil(filteredContacts.value.length / contactsPerPage.value)
)


onMounted(() => {
  filterContacts()
})
const paginatedListContacts = computed(() => {
  const startIndex = (listCurrentPage.value - 1) * contactsPerPage.value
  return filteredContacts.value.slice(startIndex, startIndex + contactsPerPage.value)
})

const paginatedGridContacts = computed(() => {
  const startIndex = (gridCurrentPage.value - 1) * contactsPerPage.value
  return filteredContacts.value.slice(startIndex, startIndex + contactsPerPage.value)

})

const openAddnewContactDialog = () => {
  addDialogVisible.value = true
}


const openDeleteDialog = (contact: any) => {
  deleteContactTarget.value = contact
  deleteDialogVisible.value = true
}

const showContactDetails = (contact: any) => {
  selectedContact.value = contact
  detailsDialogVisible.value = true

}


const filterContacts = () => {
  if (!contacts.value || contacts.value.length === 0) {
    filteredContacts.value = []
    return filterContacts()
  }
  filteredContacts.value = contacts.value.filter((contact: any) => {
    const matchesSearchQuery =
      !searchQuery.value
      || contact.name.toLowerCase().includes(searchQuery.value.toLowerCase())
      || contact.email.toLowerCase().includes(searchQuery.value.toLowerCase())
      || contact.message.toLowerCase().includes(searchQuery.value.toLowerCase())
      || contact.location.toLowerCase().includes(searchQuery.value.toLowerCase())
      || contact.phoneNumber.toLowerCase().includes(searchQuery.value.toLowerCase())

    const matchesName = !filterName.value || contact.name.toLowerCase().includes(filterName.value.toLowerCase())

    const matchesEmail = !filterEmail.value || contact.email.toLowerCase().includes(filterEmail.value.toLowerCase())

    const matchesMessage = !filterMessage.value || contact.message.toLowerCase().includes(filterMessage.value.toLowerCase())

    const matchesLocation = !filterLocation.value || contact.location.toLowerCase().includes(filterLocation.value.toLowerCase())

    const matchesPhoneNumber = !filterPhoneNumber.value || contact.phoneNumber.toLowerCase().includes(filterPhoneNumber.value.toLowerCase())

    return (matchesSearchQuery && matchesName && matchesEmail && matchesMessage && matchesLocation && matchesPhoneNumber)

  })
}

const resetFilters = () => {
  searchQuery.value = ""
  filterName.value = ""
  filterEmail.value = ""
  filterMessage.value = ""
  filterLocation.value = ""
  filterPhoneNumber.value = ""
  filterContacts()
}

const cancelAddContact = () => {
  addDialogVisible.value = false
  newContact.value = {
    name: "", email: "", message: "", location: "", phoneNumber: ""
  }
  isSaving.value = false
}



const saveNewContact = () => {
  isSaving.value = true
  if (
    !newContact.value.name?.trim() ||
    !newContact.value.email?.trim() ||
    !newContact.value.message?.trim() ||
    !newContact.value.location?.trim() ||
    !newContact.value.phoneNumber?.trim()) {
    alert("please fill in all fields to continue. ")
    return;
  }


  const newContactData = {
    id: Date.now(),
    name: newContact.value.name?.trim(),
    email: newContact.value.email?.trim(),
    message: newContact.value.message?.trim(),
    location: newContact.value.location?.trim(),
    phoneNumber: newContact.value.phoneNumber?.trim(),
  }
  contacts.value = [...contacts.value, { ...newContactData }]
  cancelAddContact();
  filterContacts();
}



const deleteContact = (contactToDelete: any) => {
  contacts.value = contacts.value.filter(a => a.id !== contactToDelete.id)
  deleteContactTarget.valueOf = null
  deleteDialogVisible.value = false
  filterContacts()
}
watch([filterName, filterEmail, filterMessage, filterPhoneNumber, filterLocation, searchQuery], () => {
  filterContacts()
  gridCurrentPage.value = 1
  listCurrentPage.value = 1
}, { immediate: true }
)


</script>

<style scoped></style>
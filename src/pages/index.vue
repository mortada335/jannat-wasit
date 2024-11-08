<template>
  <div>
    <VCard>
      <VCardText class="text-left">
        <VBtn ref="dialog" @click="openDialog" color="success">تغيير الإحصائيات</VBtn>
      </VCardText>
    </VCard>

    <VCol cols="12" md="6">
      <VDialog persistent v-model="dialog" max-width="500">
        <VCard>
          <VCardTitle> تغيير الإحصائيات </VCardTitle>
          <VCardText>
            <VForm ref="form" v-model="valid" lazy-validation>
              <VTextField
                class="mb-5"
                v-model="tempValues.investments.value"
                label="Investments"
                required
              ></VTextField>
              <VTextField
                class="mb-5"
                v-model="tempValues.equipment.value"
                label="Equipment"
                required
              ></VTextField>
              <VTextField
                v-model="tempValues.projects.value"
                label="Projects"
                required
              ></VTextField>
            </VForm>
          </VCardText>

          <VCardActions>
            <VBtn @click="closeDialog">Close</VBtn>
            <VBtn @click="saveChanges">Save</VBtn>
          </VCardActions>
        </VCard>
      </VDialog>
    </VCol>
    <!-- display the current statistics -->
    <VRow>
      <VCol cols="4" md="4">
        <VCard class="text-center pa-6" outlined>
          <VCardTitle color="success">
            {{ initialValues.investments.value }}
          </VCardTitle>
          <VCardSubtitle>الاستثمارات</VCardSubtitle>
        </VCard>
      </VCol>

      <VCol cols="4" md="4">
        <VCard class="text-center pa-6" outlined>
          <VCardTitle color="success">
            {{ initialValues.equipment.value }}
          </VCardTitle>
          <VCardSubtitle>المعدات المثبتة</VCardSubtitle>
        </VCard>
      </VCol>

      <VCol cols="4" md="4">
        <VCard class="text-center pa-6" outlined>
          <VCardTitle color="primary">
            {{ initialValues.projects.value }}
          </VCardTitle>
          <VCardSubtitle>المشاريع المنتهية</VCardSubtitle>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";

const initialValues = {
  investments: ref(22),
  equipment: ref(22),
  projects: ref(22),
};

const tempValues = {
  investments: ref(0),
  equipment: ref(0),
  projects: ref(0),
};

const dialog = ref(false);
const valid = ref(true);

const openDialog = () => {
  tempValues.investments.value = initialValues.investments.value;
  tempValues.equipment.value = initialValues.equipment.value;
  tempValues.projects.value = initialValues.projects.value;
  dialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
};

const saveChanges = () => {
  initialValues.investments.value = tempValues.investments.value;
  initialValues.equipment.value = tempValues.equipment.value;
  initialValues.projects.value = tempValues.projects.value;
  dialog.value = false;
};
</script>

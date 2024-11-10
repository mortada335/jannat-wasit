<template>
  <div>
    <VCard>
      <VCardText class="text-left">
        <VBtn @click="openDialog" color="success">تغيير الإحصائيات</VBtn>
      </VCardText>
    </VCard>

    <!-- <VCol cols="12" md="6"> -->
    <VDialog persistent v-model="dialog" max-width="500px">
      <VCard>
        <VCardTitle> تغيير الإحصائيات </VCardTitle>
        <VCardText>
          <VForm ref="form" lazy-validation>
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
          <VBtn @click="closeDialog" color="error">Cancel</VBtn>
          <VBtn @click="saveChanges" color="success">Save</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>

    <!-- display the current statistics -->
    <VRow class="mt-2">
      <VCol cols="12" md="4" sm="4">
        <VCard class="text-center pa-6">
          <VCardTitle class="text-success text-2xl">
            {{ initialValues.investments.value }}
          </VCardTitle>
          <VCardSubtitle class="text-base">الاستثمارات</VCardSubtitle>
        </VCard>
      </VCol>

      <VCol cols="4" md="4" sm="4">
        <VCard class="text-center pa-6">
          <VCardTitle class="text-success text-2xl">
            {{ initialValues.equipment.value }}
          </VCardTitle>
          <VCardSubtitle class="text-base">المعدات المثبتة</VCardSubtitle>
        </VCard>
      </VCol>

      <VCol cols="4" md="4" sm="4">
        <VCard class="text-center pa-6">
          <VCardTitle class="text-success text-2xl">
            {{ initialValues.projects.value }}
          </VCardTitle>
          <VCardSubtitle class="text-base">المشاريع المنتهية</VCardSubtitle>
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

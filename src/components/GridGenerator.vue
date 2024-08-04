<script setup>
import Header from './Header.vue';
import Jumper from './Jumper.vue';
import Map from './Map.vue';
import Form from './Form.vue';
import Download from './Download.vue';
</script>

<template>
    <v-container>
        <v-responsive class="align-center text-center overflow-visible">
            <Header />
            <Jumper />
            <Map />
            <Form />
            <Download />
        </v-responsive>
    </v-container>
</template>

<template>
  <v-app>
    <v-app-bar fixed color="info" dark>
      <v-btn fab small nuxt-link to="/" color="white" />
      <span class="ml-2">LOGO</span>
      <v-spacer></v-spacer>
      <v-btn text small class="text-capitalize">Hazte miembro</v-btn>
      <v-btn text small class="text-capitalize">Empezar</v-btn>
      <v-btn text small class="text-capitalize">Nuestros especialistas</v-btn>
      <v-btn text small class="text-capitalize">Sobre nosotros</v-btn>
      <v-btn color="white" light small class="text-capitalize" rounded>
        Iniciar sesión
      </v-btn>
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
export default {
  data() {
    return {}
  },
}
</script>

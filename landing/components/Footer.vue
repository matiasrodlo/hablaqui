<template>
  <!-- footer -->
  <section v-if="$vuetify.breakpoint.mdAndUp" class="mt-4">
    <v-container tag="section">
      <v-row justify="center">
        <v-col cols="12" md="10" xl="8">
          <v-row tag="section" align="center">
            <v-col tag="section" cols="6" sm="2">
              <v-img
                alt="Vida Tres Isapre"
                contain
                height="100"
                :src="`https://cdn.hablaqui.cl/static/VidaTresIsapre.png`"
                :lazy-src="`https://cdn.hablaqui.cl/static/VidaTresIsapre.png`"
              ></v-img>
            </v-col>
            <v-col tag="section" cols="6" sm="2">
              <v-img
                contain
                max-height="100"
                alt="nueva masvida"
                :src="`https://cdn.hablaqui.cl/static/nueva-masvida.png`"
                :lazy-src="`https://cdn.hablaqui.cl/static/nueva-masvida.png`"
              ></v-img>
            </v-col>
            <v-col tag="section" cols="6" sm="2">
              <v-img
                contain
                alt="fonasa"
                max-height="100"
                :src="`https://cdn.hablaqui.cl/static/fonasa.png`"
                :lazy-src="`https://cdn.hablaqui.cl/static/fonasa.png`"
              ></v-img>
            </v-col>
            <v-col tag="section" cols="6" sm="2">
              <v-img
                contain
                max-height="100"
                alt="ban medica"
                :src="`https://cdn.hablaqui.cl/static/banmedica.png`"
                :lazy-src="`https://cdn.hablaqui.cl/static/banmedica.png`"
              ></v-img>
            </v-col>
            <v-col tag="section" cols="6" sm="2">
              <v-img
                contain
                max-height="100"
                alt="colmena"
                :src="`https://cdn.hablaqui.cl/static/colmena.png`"
                :lazy-src="`https://cdn.hablaqui.cl/static/colmena.png`"
              ></v-img>
            </v-col>
            <v-col tag="section" cols="6" sm="2">
              <v-img
                contain
                max-height="100"
                alt="consalud"
                :src="`https://cdn.hablaqui.cl/static/consalud.png`"
                :lazy-src="`https://cdn.hablaqui.cl/static/consalud.png`"
              ></v-img>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </section>
  <section v-else class="mt-4" style="background-color: #e3f2fd">
    <v-carousel
      cycle
      height="140"
      :show-arrows="false"
      hide-delimiter-background
      hide-delimiters
      reverse-transition="fade-transition"
      transition="fade-transition"
    >
      <v-carousel-item
        v-for="(item, e) in [
          `https://cdn.hablaqui.cl/static/VidaTresIsapre.png`,
          `https://cdn.hablaqui.cl/static/nueva-masvida.png`,
          `https://cdn.hablaqui.cl/static/fonasa.png`,
          `https://cdn.hablaqui.cl/static/banmedica.png`,
          `https://cdn.hablaqui.cl/static/colmena.png`,
          `https://cdn.hablaqui.cl/static/consalud.png`,
        ]"
        :key="e"
      >
        <v-img
          height="70"
          class="mt-8"
          :src="item"
          :lazy-src="item"
          :alt="item"
          contain
        />
      </v-carousel-item>
    </v-carousel>
  </section>
</template>

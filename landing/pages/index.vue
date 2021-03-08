<template>
  <div class="mb-16">
    <!-- section 1 -->
    <v-container class="blue-grey lighten-5 pt-10" fluid>
      <v-row justify="center" align="center">
        <v-col class="info--text" cols="8">
          <div class="text-h4 text-uppercase font-weight-bold">
            Comienza a sentirte mejor
          </div>
          <div class="body-1 mt-4 text--secondary">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
            quis laudantium ad quos officia amet accusamus minus omnis ex
            nostrum tempora maxime commodi illum quisquam, eaque hic temporibus.
            Repudiandae, tempore!
          </div>
          <v-btn rounded class="mt-4 text-capitalize">Empezar ahora</v-btn>
        </v-col>
        <v-col cols="4">
          <v-card dark color="info" style="height: 300px; border-radius: 15px">
            <v-card-text> SIN IMAGEN </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- section 2 -->
    <v-container class="blue-grey lighten-3 pt-10" fluid>
      <v-row justify="center" align="center">
        <v-col class="info--text" cols="12">
          <div class="text-h4 text-center text-uppercase font-weight-bold">
            SALUD Y BIENESTAR EN TODAS LAS ÁREAS DE TU VIDA
          </div>
        </v-col>
        <v-col cols="6">
          <v-card dark color="info" style="height: 500px; border-radius: 15px">
            <v-card-text> SIN IMAGEN </v-card-text>
          </v-card>
        </v-col>
        <v-col class="info--text mt-10 mb-16" cols="12" sm="10">
          <div class="text-h4 text-center text-uppercase font-weight-bold">
            CON NUESTRO EQUIPO TE AYUDAREMOS A DESARROLLARLAS OFRECIENDO
          </div>
        </v-col>
        <v-col cols="12" sm="3">
          <div class="text-center">
            <img
              :src="require('~/assets/sin-imagen.png')"
              alt="sin imagen"
              width="100"
              style="border-radius: 50px"
            />
          </div>
          <div
            class="info--text text-h4 text-center text-uppercase font-weight-bold"
          >
            Lorem ipsum
          </div>
          <div class="body-1 mt-4 text--secondary text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
            quis laudantium ad quos officia amet accusamus minus omnis
            <br /><br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
            quis laudantium ad quos officia amet accusamus minus omnis
          </div>
        </v-col>
        <v-col cols="12" sm="3">
          <div class="text-center">
            <img
              :src="require('~/assets/sin-imagen.png')"
              alt="sin imagen"
              width="100"
              style="border-radius: 50px"
            />
          </div>
          <div
            class="info--text text-h4 text-center text-uppercase font-weight-bold"
          >
            Lorem ipsum
          </div>
          <div class="body-1 mt-4 text--secondary text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
            quis laudantium ad quos officia amet accusamus minus omnis
            <br /><br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
            quis laudantium ad quos officia amet accusamus minus omnis
          </div>
        </v-col>
        <v-col cols="12" sm="3">
          <div class="text-center">
            <img
              :src="require('~/assets/sin-imagen.png')"
              alt="sin imagen"
              width="100"
              style="border-radius: 50px"
            />
          </div>
          <div
            class="info--text text-h4 text-center text-uppercase font-weight-bold"
          >
            Lorem ipsum
          </div>
          <div class="body-1 mt-4 text--secondary text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
            quis laudantium ad quos officia amet accusamus minus omnis
            <br /><br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Reprehenderit, dolores tenetur. Unde facere doloremque sint?
          </div>
        </v-col>
        <v-col cols="12" sm="3">
          <div class="text-center">
            <img
              :src="require('~/assets/sin-imagen.png')"
              alt="sin imagen"
              width="100"
              style="border-radius: 50px"
            />
          </div>
          <div
            class="info--text text-h4 text-center text-uppercase font-weight-bold"
          >
            Lorem ipsum
          </div>
          <div class="body-1 mt-4 text--secondary text-center">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
            quis laudantium ad quos officia amet accusamus minus omnis
            <br /><br />
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate
            quis laudantium ad quos officia amet accusamus minus omnis
          </div>
        </v-col>
        <v-col cols="12" class="text-center pb-11">
          <v-btn rounded class="mt-4 text-capitalize">Hazte miembro</v-btn>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center mt-16">
          <div
            class="info--text text-h4 text-center text-uppercase font-weight-bold"
          >
            COMO FUNCIONA
          </div>
        </v-col>
        <v-col cols="12" sm="4" class="text-center">
          <div>
            <v-btn
              fab
              color="black"
              outlined
              class="elevation-0 mb-4"
              style="cursor-pointer: unset"
            >
              1
            </v-btn>
          </div>
          <div>
            <v-card
              outlined
              color="grey darken-3"
              style="height: 250px"
            ></v-card>
          </div>
          <div class="body-1 text--secondary mt-4">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod
          </div>
        </v-col>
        <v-col cols="12" sm="4" class="text-center">
          <div>
            <v-btn
              fab
              color="black"
              outlined
              class="elevation-0 mb-4"
              style="cursor-pointer: unset"
            >
              2
            </v-btn>
          </div>
          <div>
            <v-card
              outlined
              color="grey darken-3"
              style="height: 250px"
            ></v-card>
          </div>
          <div class="body-1 text--secondary mt-4">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod
          </div>
        </v-col>
        <v-col cols="12" sm="4" class="text-center">
          <div>
            <v-btn
              fab
              color="black"
              outlined
              class="elevation-0 mb-4"
              style="cursor-pointer: unset"
            >
              3
            </v-btn>
          </div>
          <div>
            <v-card
              outlined
              color="grey darken-3"
              style="height: 250px"
            ></v-card>
          </div>
          <div class="body-1 text--secondary mt-4">
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script></script>

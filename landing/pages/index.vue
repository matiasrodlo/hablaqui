<template>
  <div>
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
          <v-btn rounded class="mt-4 text-capitalize" color="primary">
            Empezar ahora
          </v-btn>
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
          <v-btn rounded class="mt-4 text-capitalize" color="primary">
            Hazte miembro
          </v-btn>
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
    <v-container class="blue-grey lighten-3" fluid>
      <v-row>
        <v-col cols="12" class="text-center my-6">
          <div class="text-h4 text-uppercase font-weight-bold info--text">
            HISTORIAS QUE INSPIRAN
          </div>
        </v-col>
        <v-col v-for="el in [1, 2, 3]" :key="el" cols="12" sm="6" md="4">
          <v-card style="border-radius: 15px">
            <v-list>
              <v-list-item>
                <v-list-item-avatar>
                  <v-icon class="grey lighten-1"></v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title
                    class="text-h4 font-weight-bold info--text"
                  >
                    Lorem ipsum dolor
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <div class="ma-4 text--secondary">
                sLorem ipsum dolor sit amet, consectetuer adipiscing elit, sed
                diam nonummy nibh euismod tincidunt ut laoreet dolore magna
                aliquam erat volutpat.
              </div>
            </v-list>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn fab color="primary" class="elevation-0">
                <v-icon color="grey lighten-1">mdi-play</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center">
          <div class="text-h4 text-uppercase font-weight-bold info--text">
            PREGUNTAS FRECUENTES
          </div>
        </v-col>
        <v-col v-for="i in [1, 2, 3, 4, 5, 6]" :key="i" cols="12" sm="6" md="4">
          <div
            style="background-color: #616161; color: #fff !important"
            class="ma-4 pa-2 text--secondary body-1"
          >
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-container class="blue-grey lighten-3" fluid>
      <v-row>
        <v-col cols="12" class="text-center my-10">
          <div class="text-h4 text-uppercase font-weight-bold info--text">
            SUBCRIBETE A NUESTRA NEWSLETTER
          </div>
        </v-col>
        <v-col cols="12" sm="10" md="6" offset-md="3">
          <v-text-field
            filled
            outlined
            label="Correo electronico"
          ></v-text-field>
          <div
            class="body-1 text-uppercase font-weight-bold info--text text-center"
          >
            Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam
            nonummy nibh euismod tincidunt ut laoreet dolore magna aliquam erat
          </div>
        </v-col>
      </v-row>
    </v-container>
    <v-footer dark padless>
      <v-card flat tile class="white--text text-center" color="info" dark>
        <v-card-text>
          <v-row>
            <v-col cols="4">
              <v-list-item-avatar class="ma-1">
                <v-icon class="grey lighten-1"></v-icon>
              </v-list-item-avatar>
              <v-list-item-avatar class="ma-1">
                <v-icon class="grey lighten-1"></v-icon>
              </v-list-item-avatar>
              <v-list-item-avatar class="ma-1">
                <v-icon class="grey lighten-1"></v-icon>
              </v-list-item-avatar>
              <v-list-item-avatar class="ma-1">
                <v-icon class="grey lighten-1"></v-icon>
              </v-list-item-avatar>
              <div class="body-1 text-uppercase font-weight-bold">
                Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit
              </div>
            </v-col>
            <v-col cols="8" class="text-left">
              <v-row>
                <v-col cols="12" sm="4">
                  <div class="body-1 text-uppercase font-weight-bold">
                    SOBRE NOSOTROS
                  </div>
                  Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit
                  amet. Mauris cursus commodo interdum. Praesent ut risus eget
                  metus luctus accumsan id ultrices nunc. Sed at orci sed massa
                  consectetur dignissim a sit amet dui. Duis commodo vitae velit
                  et faucibus. Morbi vehicula lacinia malesuada. Nulla placerat
                  augue vel ipsum ultrices, cursus iaculis dui sollicitudin.
                  Vestibulum eu ipsum vel diam elementum tempor vel ut orci.
                  Orci varius natoque penatibus et magnis dis parturient montes,
                  nascetur ridiculus mus.
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="body-1 text-uppercase font-weight-bold">
                    SERVICIOS
                  </div>
                  Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit
                  amet. Mauris cursus commodo interdum. Praesent ut risus eget
                  metus luctus accumsan id ultrices nunc. Sed at orci sed massa
                  consectetur dignissim a sit amet dui. Duis commodo vitae velit
                  et faucibus. Morbi vehicula lacinia malesuada. Nulla placerat
                  augue vel ipsum ultrices, cursus iaculis dui sollicitudin.
                  Vestibulum eu ipsum vel diam elementum tempor vel ut orci.
                  Orci varius natoque penatibus et magnis dis parturient montes,
                  nascetur ridiculus mus.
                </v-col>
                <v-col cols="12" sm="4">
                  <div class="body-1 text-uppercase font-weight-bold">
                    RECURSOS
                  </div>
                  Phasellus feugiat arcu sapien, et iaculis ipsum elementum sit
                  amet. Mauris cursus commodo interdum. Praesent ut risus eget
                  metus luctus accumsan id ultrices nunc. Sed at orci sed massa
                  consectetur dignissim a sit amet dui. Duis commodo vitae velit
                  et faucibus. Morbi vehicula lacinia malesuada. Nulla placerat
                  augue vel ipsum ultrices, cursus iaculis dui sollicitudin.
                  Vestibulum eu ipsum vel diam elementum tempor vel ut orci.
                  Orci varius natoque penatibus et magnis dis parturient montes,
                  nascetur ridiculus mus.
                </v-col>
              </v-row>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-footer>
  </div>
</template>

<script></script>

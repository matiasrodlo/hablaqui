/**
 * Privacy Policy Page Component
 *
 * This component displays the privacy policy for users of the Hablaquí platform.
 * It explains how user data is collected, processed, and protected, and outlines user rights.
 *
 * @module utils/page-trash/politicas
 */

<template>
  <div>
    <div class="primary-color">
      <div style="margin-bottom: 83px">
        <Appbar />
      </div>
      <div
        class="white--text font-weight-bold text-h5 text-md-h4 text-lg-h3 text-center py-16"
      >
        Políticas de Privacidad
      </div>
    </div>
    <v-container class="mt-16" fluid style="max-width: 1080px">
      <v-row justify="center" class="mb-16">
        <v-col cols="12" md="12">
          <strong>1.Información general</strong><br />
          <br />
          Esta Política de Privacidad contiene información sobre la forma en que
          tratamos, total o parcialmente, de forma automatizada o no, los datos
          personales de los usuarios que acceden a nuestra plataforma. Su
          objetivo es aclarar a los interesados los tipos de datos que se
          recogen, los motivos de la recogida y la forma en que el usuario puede
          actualizar, gestionar o eliminar esta información. Esta Política de
          Privacidad puede ser actualizada como consecuencia de cualquier
          actualización normativa, por lo que se invita al usuario a consultar
          periódicamente esta sección.
        </v-col>
        <v-col cols="12" md="12">
          <strong>2.Derechos de los usuarios</strong><br />
          <br />
          La app se compromete a cumplir con la normativa establecida en el
          RGPD, respecto a los siguientes principios:
          <br />
          <br />
          <ul>
            <li>
              Los datos personales del usuario se tratarán de forma legal, justa
              y transparente (legalidad, equidad y transparencia);
            </li>
            <li>
              Los datos personales del usuario se recogerán únicamente para
              fines específicos, explícitos y legítimos, y no podrán ser
              tratados posteriormente de forma incompatible con dichos fines
              (limitación de la finalidad);
            </li>
            <li>
              Sus datos personales se recogerán de forma adecuada, pertinente y
              limitada a las necesidades de la finalidad para la que se tratan
              (minimización de datos);
            </li>
            <li>
              Los datos personales del usuario serán exactos y se actualizarán
              cuando sea necesario, de modo que los datos inexactos se
              suprimirán o rectificarán cuando sea posible (exactitud);
            </li>
            <li>
              Los datos personales del usuario se conservarán en una forma que
              permita la identificación de los interesados solo durante el
              tiempo necesario para los fines para los que se tratan (limitación
              del almacenamiento);
            </li>
            <li>
              Los datos personales del usuario se tratarán de forma segura,
              protegidos contra el tratamiento no autorizado o ilícito y contra
              la pérdida, destrucción o daño accidentales mediante la adopción
              de medidas técnicas u organizativas adecuadas (integridad y
              confidencialidad).
            </li>
          </ul>
          <br />
          <div>
            El usuario de la app tiene los siguientes derechos, conferidos por
            la Ley de Protección de Datos Personales y el RGPD:
          </div>
          <br />
          <ul>
            <li>
              Derecho de confirmación y acceso: es el derecho del usuario a
              obtener de la plataforma la confirmación de que los datos
              personales que le conciernen son o no objeto de tratamiento y, en
              su caso, el derecho a acceder a sus datos personales;
            </li>
            <li>
              Derecho de rectificación: derecho del usuario a obtener de la
              plataforma, sin demora indebida, la rectificación de los datos
              personales inexactos que le conciernen;
            </li>
            <li>
              Derecho al borrado de datos (derecho al olvido): es el derecho del
              usuario a que sus datos sean borrados de la plataforma;
            </li>
            <li>
              Derecho a la limitación del tratamiento de datos: derecho del
              usuario a la limitación del tratamiento de sus datos personales,
              que puede obtener cuando impugne la exactitud de los datos, cuando
              el tratamiento sea ilícito, cuando la plataforma ya no necesite
              los datos para los fines propuestos y cuando se haya opuesto al
              tratamiento de los datos y en el caso de tratamiento de datos
              innecesarios;
            </li>
            <li>
              Derecho de oposición: es el derecho del usuario a oponerse en
              cualquier momento, por motivos relacionados con su situación
              particular, al tratamiento de los datos personales que le
              conciernen, pudiendo también oponerse a la utilización de sus
              datos personales para la elaboración de perfiles comerciales
              (profiling);
            </li>
            <li>
              Derecho a la portabilidad de los datos: es el derecho del usuario
              a recibir los datos personales que le conciernen y que ha
              proporcionado a la plataforma, en un formato estructurado, de uso
              común y legible por máquina, y el derecho a transmitir estos datos
              a otra aplicación;
            </li>
            <li>
              Derecho a no ser sometido a decisiones automatizadas: es el
              derecho del usuario a no ser sometido a ninguna decisión tomada
              exclusivamente sobre la base de un tratamiento automatizado,
              incluida la elaboración de perfiles, que produzca efectos en su
              esfera jurídica o le afecte significativamente de forma similar.
            </li>
          </ul>
          <br />
          <div>
            Puede ejercer sus derechos mediante comunicación escrita enviada con
            Hablaquí.
          </div>
        </v-col>
        <v-col cols="12" md="12">
          <strong>3.Obligación de no facilitar datos de terceros</strong> <br />
          <br />
          La recogida de los datos del usuario se realizará de acuerdo con lo
          establecido en esta Política de Privacidad y dependerá del
          consentimiento del usuario. La aplicación utiliza servicios de
          terceros que pueden recoger información utilizada para identificarle.
        </v-col>
        <v-col cols="12" md="12">
          <strong>4.Tipos de datos recogidos</strong> <br />
        </v-col>
        <v-col cols="12" md="12">
          <strong
            >4.1.1 Datos de identificación del usuario para el registro</strong
          >
          <br /><br />
          El uso, por parte del usuario, de determinadas funcionalidades de la
          aplicación dependerá del registro, en cuyo caso, se recogerán y
          almacenarán sus datos.
        </v-col>
        <v-col cols="12" md="12">
          <strong>Datos facilitados en el formulario de contacto</strong> <br />
          <br />
          Los datos eventualmente informados por el usuario que utiliza el
          formulario de contacto disponible en la plataforma, incluyendo el
          contenido del mensaje enviado, serán recogidos y almacenados.
        </v-col>
        <v-col cols="12" md="12">
          <strong>4.1.4 Datos sensibles</strong> <br />
          <br />
          La plataforma puede recoger los siguientes datos sensibles de los
          usuarios:
          <br />
          <br />
          <ul>
            <li>Datos que revelen el origen racial o étnico</li>
            <li>Datos relativos a la salud del usuario</li>
            <li>
              Datos relativos a la vida sexual u orientación sexual del usuario
            </li>
          </ul>
        </v-col>
        <v-col cols="12" md="12">
          <strong>4.1.6. Recogida de datos no previstos expresamente</strong>
          <br />
          <br />
          Ocasionalmente, pueden recogerse otros tipos de datos no previstos
          expresamente en esta Política de Privacidad, siempre que se faciliten
          con el consentimiento del usuario, o que la recogida esté permitida o
          sea exigida por la ley.
        </v-col>
        <v-col cols="12" md="12">
          <strong
            >4.2 Base legal para el tratamiento de los datos personales
          </strong>
          <br />
          <br />
          Al utilizar los servicios de la plataforma, el usuario acepta esta
          política de privacidad. El usuario tiene derecho a retirar su
          consentimiento en cualquier momento, sin que ello comprometa la
          legalidad del tratamiento de sus datos personales antes de la
          retirada. La retirada del consentimiento puede hacerse por correo
          electrónico: c@hablaqui.com
        </v-col>
        <v-col cols="12" md="12">
          <strong> 4.3 Finalidades del tratamiento de datos personales </strong>
          <br />
          <br />
          Los datos personales del usuario recogidos por la plataforma tienen
          como finalidad facilitar, agilizar y cumplir los compromisos
          establecidos con el usuario, así como atender las peticiones que este
          realice. <br />
          <br />
          Los datos personales también pueden utilizarse con fines comerciales
          para personalizar el contenido ofrecido al usuario, así como para
          proporcionar a la plataforma subvenciones para mejorar la calidad y el
          funcionamiento de sus servicios. <br />
          <br />
          La plataforma recoge los datos del usuario para realizar la
          elaboración de perfiles, es decir, el tratamiento automatizado de
          datos personales que consiste en utilizar estos datos para evaluar
          determinados aspectos personales del usuario, principalmente para
          analizar o predecir características relacionadas con su desempeño
          profesional, su situación económica, su salud, sus preferencias
          personales, sus intereses, su fiabilidad, su comportamiento, su
          ubicación o su desplazamiento. <br />
          <br />
          Los datos de registro se utilizarán para permitir al usuario el acceso
          a determinados contenidos de la plataforma, exclusivos para los
          usuarios registrados. <br />
          <br />
          El tratamiento de los datos personales para fines no previstos en esta
          Política de Privacidad solo se producirá previa comunicación al
          usuario, siendo que, en todo caso, seguirán siendo aplicables los
          derechos y obligaciones aquí previstos.
        </v-col>
        <v-col cols="12" md="12">
          <strong> 4.4 Plazo de conservación de los datos personales </strong>
          <br />
          <br />
          Los datos personales del usuario se conservarán durante un período
          máximo de 12 meses tras la finalización del tratamiento al que están
          destinados, a menos que el usuario solicite su supresión antes de que
          finalice dicho período. <br />
          <br />
          Los datos personales de los usuarios sólo podrán conservarse una vez
          finalizado su tratamiento en los siguientes casos: <br />
          <br />
          <ul>
            <li>
              para el cumplimiento de una obligación legal o reglamentaria por
              parte del responsable del tratamiento;
            </li>
            <li>
              para su estudio por un organismo de investigación, garantizando,
              siempre que sea posible, la anonimización de los datos personales;
            </li>
            <li>
              para su transferencia a un tercero, siempre que se cumplan los
              requisitos de tratamiento de datos previstos en la legislación;
            </li>
            <li>
              para uso exclusivo del responsable del tratamiento, sin acceso de
              terceros, y siempre que los datos estén anonimizados.
            </li>
          </ul>
        </v-col>
        <v-col cols="12" md="12">
          <strong
            >5. Seguridad en el tratamiento de los datos personales del usuario
          </strong>
          <br />
          <br />
          Los datos personales del usuario no serán compartidos con terceros.
          Por lo tanto, sólo serán procesados por esta plataforma.
        </v-col>
        <v-col cols="12" md="12">
          <strong
            >5. Seguridad en el tratamiento de los datos personales del usuario
          </strong>
          <br />
          <br />
          La plataforma se compromete a aplicar las medidas técnicas y
          organizativas para proteger los datos personales del acceso no
          autorizado y de las situaciones de destrucción, pérdida, alteración,
          comunicación o difusión de los mismos. <br />
          <br />
          Para garantizar la seguridad, se adoptarán soluciones que tengan en
          cuenta: las técnicas adecuadas; los costes de aplicación; la
          naturaleza, el alcance, el contexto y los fines del tratamiento; y los
          riesgos para los derechos y libertades del usuario. <br />
          <br />
          La plataforma utiliza la certificación SSL (Secure Socket Layer) que
          garantiza que los datos personales se transmiten de forma segura y
          confidencial, de modo que la transmisión de datos entre el servidor y
          el usuario, y en la retroalimentación, se produce de forma totalmente
          cifrada o encriptada.
          <br /><br />
          Sin embargo, la plataforma está exenta de responsabilidad por la culpa
          exclusiva de un tercero, como en el caso de un ataque de hackers o
          crackers, o por la culpa exclusiva del usuario, como en el caso de que
          el propio usuario transfiera sus datos a un tercero. <br />
          <br />
          Además, la aplicación se compromete a notificar al usuario en un plazo
          adecuado en caso de que se produzca cualquier tipo de violación de la
          seguridad de sus datos personales que pueda suponer un alto riesgo
          para sus derechos y libertades personales. <br />
          <br />
          Una violación de los datos personales es un fallo de seguridad que da
          lugar a la destrucción accidental o ilícita, la pérdida, la
          alteración, la divulgación no autorizada o el acceso a datos
          personales transmitidos, almacenados o tratados de otro modo.
          <br /><br />
          Por último, la plataforma se compromete a tratar los datos personales
          del usuario de forma confidencial, dentro de los límites legales.
        </v-col>
        <v-col cols="12" md="12">
          <strong>6. Datos de navegación (cookies) </strong>
          <br />
          <br />
          Las cookies son pequeños archivos de texto que la aplicación envía al
          ordenador del usuario y que se almacenan en él, conteniendo
          información relacionada con la navegación por la aplicación.
          <br />
          <br />
          Mediante las cookies, el navegador del usuario almacena pequeñas
          cantidades de información para que nuestro servidor pueda leerlas
          posteriormente. Se pueden almacenar, por ejemplo, datos sobre el
          dispositivo utilizado por el usuario, así como su ubicación y la hora
          de acceso a la plataforma.
          <br />
          <br />
          Las cookies no permiten extraer ningún archivo o información del disco
          duro del usuario y no es posible, a través de ellas, acceder a
          información personal que no provenga del usuario o de la forma en que
          este utiliza los recursos de la plataforma.
          <br />
          <br />
          Es importante señalar que no todas las cookies contienen información
          que permita identificar al usuario, y que ciertos tipos de cookies
          pueden utilizarse simplemente para asegurar que la plataforma se carga
          correctamente o para que funcione como se espera.
          <br />
          <br />
          Cualquier información almacenada en las cookies que permita
          identificar a un usuario es considerada como datos personales. Como
          tal, todas las normas previstas en esta Política de Privacidad también
          se aplican a ellos.
        </v-col>
        <v-col cols="12" md="12">
          <strong> 7.0 Cookies de la plataforma </strong>
          <br />
          <br />
          Las cookies de plataforma son cookies que se envían al ordenador o
          dispositivo del usuario y que son administradas exclusivamente por la
          plataforma.
          <br /><br />
          La información recopilada por medio de estas cookies se utiliza para
          mejorar y personalizar la experiencia del usuario, con algunas cookies
          que se utilizan, por ejemplo, para recordar las preferencias y
          elecciones del usuario, así como para ofrecer contenido personalizado.
          <br /><br />
          Estos datos de navegación también pueden ser compartidos con cualquier
          socio de la aplicación, buscando la mejora de los productos y
          servicios ofrecidos al usuario.
        </v-col>
        <v-col cols="12" md="12">
          <strong> 7.1 Cookies de redes sociales</strong>
          <br />
          <br />
          La plataforma utiliza plugins de redes sociales, que permiten acceder
          a ellas desde la plataforma. Por lo tanto, al hacerlo, las cookies
          utilizadas por ellos pueden ser almacenadas en el navegador del
          usuario.
          <br />
          <br />
          Cada red social tiene su propia política de privacidad y protección de
          datos personales, y las personas físicas o jurídicas que las mantienen
          son responsables de los datos recogidos y de las prácticas de
          privacidad adoptadas.
        </v-col>
        <v-col cols="12" md="12">
          <strong
            >7.2 Gestión de las cookies y de la configuración del
            navegador</strong
          >
          <br />
          <br />
          El Usuario puede oponerse al registro de cookies por parte de la
          plataforma, simplemente desactivando esta opción en su propio
          navegador o dispositivo.
          <br />
          <br />
          La desactivación de las cookies, sin embargo, puede afectar a la
          disponibilidad de algunas herramientas y funcionalidades de la
          plataforma, comprometiendo su correcto y esperado funcionamiento. Otra
          posible consecuencia es la eliminación de las preferencias del usuario
          que puedan haberse guardado, perjudicando la experiencia del usuario.
          <br />
          <br />
          A continuación se muestran algunos enlaces a las páginas de ayuda y
          soporte de los navegadores más utilizados, a los que puede acceder el
          usuario interesado en obtener más información sobre la gestión de las
          cookies en su navegador:
        </v-col>
        <v-col cols="12" md="12">
          <strong> 8. Reclamación a una autoridad de control</strong>
          <br />
          <br />
          Sin perjuicio de cualquier otro recurso administrativo o judicial,
          todos los interesados tienen derecho a presentar una reclamación ante
          una autoridad de control. La denuncia puede presentarse ante la
          autoridad de la sede de la plataforma, del país de residencia habitual
          del usuario, de su lugar de trabajo o del lugar en el que
          supuestamente se ha cometido la infracción.
        </v-col>
        <v-col cols="12" md="12">
          <strong> 9. Cambios</strong>
          <br />
          <br />
          Esta versión de la Política de Privacidad fue actualizada por última
          vez el: 08/09/2021.
          <br />
          <br />
          El editor se reserva el derecho de modificar en cualquier momento la
          aplicación de estas normas, en particular para adaptarlas a las
          evoluciones de la plataforma Hablaquí, ya sea proporcionando nuevas
          funcionalidades o suprimiendo o modificando las ya existentes.
          <br />
          <br />
          El usuario será notificado explícitamente en caso de modificación de
          esta política.
          <br />
          <br />
          Al utilizar el servicio después de cualquier modificación, el usuario
          muestra su acuerdo con las nuevas normas. En caso de que no esté de
          acuerdo con alguna de las modificaciones, deberá solicitar
          inmediatamente la cancelación de su cuenta y presentar su queja al
          servicio de atención al cliente si así lo desea.
        </v-col>
      </v-row>
      <v-row justify="center" align="center" class="mb-8">
        <v-col cols="12" md="6" class="text-center text-md-left">
          <div style="color: #bdbdbd" class="my-4">
            <v-btn
              text
              class="pl-0 text--disabled"
              style="text-decoration: none"
              :to="{ name: 'politicas' }"
              target="_blank"
              >Aviso de privacidad
            </v-btn>
            y
            <v-btn
              text
              class="text--disabled"
              style="text-decoration: none"
              :to="{ name: 'condiciones' }"
              target="_blank"
            >
              Términos y Condiciones
            </v-btn>
          </div>
          <div class="text--secondary">
            © 2021 Hablaquí · Todos los derechos reservados
          </div>
        </v-col>
        <v-col
          cols="12"
          md="6"
          class="text-center text-md-right text--secondary"
        >
          <div>
            <a
              style="text-decoration: none"
              href="https://www.facebook.com/hablaquicom"
              target="_blank"
            >
              <img
                style="height: 40px"
                :src="`https://cdn.hablaqui.cl/static/logo_facebook.png`"
                alt="logo facebook"
              />
            </a>
            <a
              style="text-decoration: none"
              href="https://www.instagram.com/hablaqui"
              target="_blank"
            >
              <img
                style="height: 40px"
                :src="`https://cdn.hablaqui.cl/static/logo_instagram.png`"
                alt="logo instagram"
              />
            </a>
            <a
              style="text-decoration: none"
              href="https://www.linkedin.com/company/hablaqui"
              target="_blank"
            >
              <img
                style="height: 40px"
                :src="`https://cdn.hablaqui.cl/static/logo_linkedin.png`"
                alt="logo linkedin"
              />
            </a>
          </div>
          <div class="my-4">Atención a clientes: soporte@hablaqui.cl</div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
/**
 * Privacy Policy Page Component
 *
 * @component Politicas
 * @description Renders the privacy policy, including data collection, processing, and user rights.
 *
 * @example
 * // Access via URL: /politicas
 */
export default {
  components: {
    Appbar: () => import('@/components/AppbarWhite'),
  },
  head() {
    return {
      title: 'Politicas de privacidad | Hablaquí',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Politicas de privacidad hablaqui',
        },
      ],
      link: [
        {
          rel: 'canonical',
          href: `https://cdn.hablaqui.cl/static/politicas/`,
        },
      ],
    }
  },
}
</script>

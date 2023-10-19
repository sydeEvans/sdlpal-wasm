<script>
export default {
  name: "Loading",
  props: ['title']
}
</script>

<template>
  <div class="container">

    <!-- Death Stranding -->
    <div class="container-loader">
      <svg height="100" width="100">
        <animate
            xlink:href="#ds-point-one"
            attributeName="fill"
            repeatCount="indefinite"
            values="#fff; #000; #000;"
            dur="2s"
            begin="0s"
            keyTimes="0; .5; 1"/>

        <animate
            xlink:href="#ds-point-two"
            attributeName="fill"
            repeatCount="indefinite"
            values="#fff; #000; #000;"
            dur="2s"
            begin="0.4s"
            keyTimes="0; .5; 1"/>

        <animate
            xlink:href="#ds-point-three"
            attributeName="fill"
            repeatCount="indefinite"
            values="#fff; #000; #000;"
            dur="2s"
            begin="0.8s"
            keyTimes="0; .5; 1"/>

        <animate
            xlink:href="#ds-point-four"
            attributeName="fill"
            repeatCount="indefinite"
            values="#fff; #000; #000;"
            dur="2s"
            begin="1.2s"
            keyTimes="0; .5; 1"/>

        <animate
            xlink:href="#ds-point-five"
            attributeName="fill"
            repeatCount="indefinite"
            values="#fff; #000; #000;"
            dur="2s"
            begin="1.6s"
            keyTimes="0; .5; 1"/>

        <polygon
            id="ds-point-one"
            points="50,0 35,30 50,50 65,30"
            style="fill:black;" />
        <polygon
            id="ds-point-two"
            points="50,0 35,30 50,50 65,30"
            style="fill:black;"
            transform="rotate(73 50 50)" />
        <polygon
            id="ds-point-three"
            points="50,0 35,30 50,50 65,30"
            style="fill:black;"
            transform="rotate(145 50 50)" />
        <polygon
            id="ds-point-four"
            points="50,0 35,30 50,50 65,30"
            style="fill:black;"
            transform="rotate(-145 50 50)" />
        <polygon
            id="ds-point-five"
            points="50,0 35,30 50,50 65,30"
            style="fill:black;"
            transform="rotate(-73 50 50)" />

      </svg>
      <p>{{ title }}</p>
    </div>

    <!-- NieR:Automata -->
<!--    <div class="container-loader">-->
<!--      <svg height="100" width="100">-->
<!--        <circle cx="50" cy="50" r="46" fill="#000" stroke="#fff" stroke-width="4" />-->
<!--        <circle cx="50" cy="50" r="32" fill="#000" stroke="#fff" stroke-width="16" />-->
<!--        <circle cx="50" cy="50" r="20" fill="#fff" />-->

<!--        <path id="nier-auto" fill="#fff" stroke="#000" stroke-width="6" d="M 26,78 C 30,92 70,92 74,78"-->
<!--              transform="rotate(0 50 50)" />-->

<!--        <animateTransform-->
<!--            xlink:href="#nier-auto"-->
<!--            attributeName="transform"-->
<!--            type="rotate"-->
<!--            from="0 50 50" to="360 50 50"-->
<!--            begin="0s" dur="1s"-->
<!--            repeatCount="indefinite"/>-->
<!--      </svg>-->
<!--      <p>NieR:Automata</p>-->
<!--    </div>-->

  </div>
</template>

<style scoped lang="scss">
.container {
  margin: 25px auto;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.container-loader {
  margin: 15px;
  padding: 15px;
  width: 400px;
  height: 200px;
  color: #fff;
  text-align: center;
}

</style>

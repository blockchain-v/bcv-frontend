<template>
  <div class="about">
    <img
      class="bcv-logo"
      src="@/assets/BCV-logos_transparent.png"
      alt="BCV logo"
    />
    <div class="description">
      <h2>Disclaimer</h2>
      <p>
        This application has been produced as part of the
        <a
          href="https://www.csg.uzh.ch/theses/theses.html?thesisid=273"
          target="_blank"
          >"BCV" Master project</a
        >
        at the
        <a href="https://www.csg.uzh.ch/csg/en/" target="_blank"
          >Communication Systems Group</a
        >
        (CSG) at the University of Zurich, Department of Informatics.
      </p>
    </div>
  </div>
</template>

<script></script>

<style lang="scss" scoped>
@import "src/styles/global.scss";

.about {
  position: relative;
  top: -30px;

  .bcv-logo {
    height: 220px;
  }

  .description {
    width: 30%;
    margin-inline: auto;
    text-align: start;
  }
}
</style>

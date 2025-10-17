import {
  AssetType,
  Mesh,
  MeshStandardMaterial,
  SphereGeometry,
  SessionMode,
  AssetManager,
  World,
} from '@iwsdk/core';

import {
  AudioSource,
  DistanceGrabbable,
  MovementMode,
  Interactable,
  PanelUI,
  ScreenSpace
} from '@iwsdk/core';

import { 
  EnvironmentType, 
  LocomotionEnvironment 
} from '@iwsdk/core';

import { PanelSystem } from './panel.js';



const assets = {
  plantSansevieria: {
    url: '/gltf/plantSansevieria/plantSansevieria.gltf',
    type: AssetType.GLTF,
    priority: 'critical'
  },
};


World.create(document.getElementById('scene-container'), {
  assets,
  xr: {
    sessionMode: SessionMode.ImmersiveVR,
    offer: 'always',
    // Optional structured features; layers/local-floor are offered by default
    features: { 
      handTracking: false, 
      layers: true } 
  },

  features: { locomotion: false, 
    grabbing: false, 
    physics: false, 
    sceneUnderstanding: false },

  // import scene created in Meta Spatial Editor
  // level: "/glxf/Composition.glxf",

}).then((world) => {

  const { camera } = world;

  
   // Create a green sphere
   const sphereGeometry = new SphereGeometry(0.5, 32, 32);
   const greenMaterial = new MeshStandardMaterial({ color: 0x33ff33 });
   const sphere = new Mesh(sphereGeometry, greenMaterial);
   sphere.position.set(1, 0, -2);
   const sphereEntity = world.createTransformEntity(sphere)
      //.addComponent(Interactable)
      //.addComponent(DistanceGrabbable, {
      //   movementMode: MovementMode.MoveFromTarget
      // })
    ;
  
  // Add a plant 3d model
  const { scene: plantMesh } = AssetManager.getGLTF('plantSansevieria');
  plantMesh.position.set(1.2, 0.85, -1.8);
  world.createTransformEntity(plantMesh);



  // Register all systems that were imported
  world.registerSystem(PanelSystem);







  // vvvvvvvv EVERYTHING BELOW WAS ADDED TO DISPLAY A BUTTON TO ENTER VR FOR QUEST 1 DEVICES vvvvvv
  //          (for some reason IWSDK doesn't show Enter VR button on Quest 1)

  if (isMetaQuest1()) {
    const panelEntity = world
      .createTransformEntity()
      .addComponent(PanelUI, {
        config: '/ui/welcome.json',
        maxHeight: 0.8,
        maxWidth: 1.6
      })
      .addComponent(Interactable)
      .addComponent(ScreenSpace, {
        top: '20px',
        left: '20px',
        height: '40%'
      });
    panelEntity.object3D.position.set(0, 1.29, -1.9);
  } else {
    // Skip panel on non-Meta-Quest-1 devices
    // Useful for debugging on desktop or newer headsets.
    console.log('Panel UI skipped: not running on Meta Quest 1 (heuristic).');
  }
  function isMetaQuest1() {
    try {
      const ua = (navigator && (navigator.userAgent || '')) || '';
      const hasOculus = /Oculus|Quest|Meta Quest/i.test(ua);
      const isQuest2or3 = /Quest\s?2|Quest\s?3|Quest2|Quest3|MetaQuest2|Meta Quest 2/i.test(ua);
      return hasOculus && !isQuest2or3;
    } catch (e) {
      return false;
    }
  }

});

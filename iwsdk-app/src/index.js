

import {
  AssetType,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  SphereGeometry,
  PlaneGeometry,
  SessionMode,
  SRGBColorSpace,
  AssetManager,
  World,
  DirectionalLight,
  AmbientLight,
  PointLight
} from '@iwsdk/core';

import {
  AudioSource,
  DistanceGrabbable,
  MovementMode,
  Interactable,
  PanelUI,
  PlaybackMode,
  ScreenSpace
} from '@iwsdk/core';

import { PanelSystem } from "./panel.js";


import { EnvironmentType, LocomotionEnvironment } from '@iwsdk/core';

// import { PanelSystem } from './panel.js';

// import { Robot } from './robot.js';

// import { RobotSystem } from './robot.js';

const assets = {
  // chimeSound: {
  //   url: '/audio/chime.mp3',
  //   type: AssetType.Audio,
  //   priority: 'background'
  // },
  // webxr: {
  //   url: '/textures/webxr.png',
  //   type: AssetType.Texture,
  //   priority: 'critical'
  // },
  // environmentDesk: {
  //   url: '/gltf/environmentDesk/environmentDesk.gltf',
  //   type: AssetType.GLTF,
  //   priority: 'critical'
  // },
  plantSansevieria: {
    url: '/gltf/plantSansevieria/plantSansevieria.gltf',
    type: AssetType.GLTF,
    priority: 'critical'
  },
  // robot: {
  //   url: '/gltf/robot/robot.gltf',
  //   type: AssetType.GLTF,
  //   priority: 'critical'
  // }
};

World.create(document.getElementById('scene-container'), {
  assets,
  xr: {
    sessionMode: SessionMode.ImmersiveVR,
    //offer: 'always',
    // Optional structured features; layers/local-floor are offered by default
    //features: { handTracking: true, layers: true } 
  },
  //features: { locomotion: { useWorker: true }, grabbing: true, physics: false, sceneUnderstanding: false },
  //level: "/glxf/Composition1.glxf",  
}).then((world) => {
  const { camera } = world;
  
  // camera.position.set(-4, 1.5, -6);
  // camera.rotateY(-Math.PI * 0.75);

//   const dirLight = new DirectionalLight(0xffffff, 4);
// dirLight.position.set(3, 10, 5);
// world.scene.add(dirLight);

// const pointLight = new PointLight(0xffffff, 2, 10); // color, intensity, range
// pointLight.position.set(1, 2, 1); // adjust position relative to the sphere
// world.scene.add(pointLight);

// const ambient = new AmbientLight(0xffffff, 0.3);
// world.scene.add(ambient);
  
   // Create a green sphere
   const sphereGeometry = new SphereGeometry(0.5, 32, 32);
   const greenMaterial = new MeshStandardMaterial({ color: 0x33ff33 });
   const sphere = new Mesh(sphereGeometry, greenMaterial);
   sphere.position.set(1, 0, -2);
   const sphereEntity = world.createTransformEntity(sphere)
       //.addComponent(Interactable)
    //.addComponent(DistanceGrabbable, {
      //movementMode: MovementMode.MoveFromTarget
    //})
    ;
  

  const { scene: plantMesh } = AssetManager.getGLTF('plantSansevieria');
  
  
  plantMesh.position.set(1.2, 0.85, -1.8);
  
  world
    .createTransformEntity(plantMesh)
    // .addComponent(Interactable)
    // .addComponent(DistanceGrabbable, {
    //   movementMode: MovementMode.MoveFromTarget
    // })
    ;


  world.registerSystem(PanelSystem);








  // Add Panel to Enter VR only for Meta Quest 1 devices
  // (for some reason IWSDK doesn't show Enter VR button on Quest 1
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

  // test to see if headset being used is Meta Quest 1
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

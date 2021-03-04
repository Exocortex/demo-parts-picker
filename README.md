# Pricefx Parts Picker
Hi Pricefx team, here is some information on the parts demo.

# Configuration

## Auth Token
Please enter your Threekit auth token in `./src/config/index.js` or the player will not load.

## Asset IDs
You can find the Threekit AssetIDs for each system in `./src/componentss/Form/index.js` in the objects' `key`:
```
  let menuData = [
    {
      title: "Parts",
      key: "01",
      children: [
        {
          title: "Cooling System",
          key: "da0d6c3f-64a2-491f-a7d9-c924d9698e88",
          children: menuLoading ? loadingMenuObject : menu,
          isLeaf: false,
        },
        {
          title: "Exhaust",
          key: "ef49b5c0-86b8-4c3d-965e-aaabd057707c",
          children: menuLoading ? loadingMenuObject : menu,
          isLeaf: false,
        },
      ],
      isLeaf: false,
    },
  ];
```

## Threekit Player
You can find the player being initialized in with highlight funtionality in `./src/components/Player/index.js` 

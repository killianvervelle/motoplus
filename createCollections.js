import fetch from 'node-fetch';
import process from 'process'
import 'dotenv/config';
import fs from "fs";
import readline from 'node:readline';


const SHOP = process.env.SHOPIFY_STORE_DOMAIN;      // e.g. motoplus-site76.myshopify.com
const API_VERSION = process.env.SHOPIFY_API_VERSION ;
const TOKEN = process.env.SHOPIFY_ADMIN_SECRET;    // your Admin API access token

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// --- your category data ---
// paste only the top-level objects that have submenu arrays:
const categories = [
  // 🔹 Advertising & Promotional
  {
  name: "PEÇAS NOVAS",
  slug: "new-parts",
  kind: "category",
  submenu: [
    {
      name: "Transmissão",
      slug: "drivetrain",
      imageBlack: "/images/wheelB.png",
      imageWhite: "/images/wheelW.png",
      submenu: [
        { name: "Correntes", slug: "chains" },
        { name: "Pinhões", slug: "sprockets" },
        { name: "Protetor de corrente", slug: "chain-guard" },
        { name: "Kit corrente e pinhões", slug: "chain-and-sprockets-kit" },
        { name: "Sistema lubrificação de corrente", slug: "chain-oiler-system" },
        { name: "Ferramentas de corrente", slug: "chain-tools" },
        { name: "Embraiagem", slug: "clutch" },
        { name: "Disco de embraiagem", slug: "clutch-plate" }
      ]
    },
    {
      name: "Depósito de combustível",
      slug: "fuel-tank",
      imageBlack: "/images/gas-tankB.png",
      imageWhite: "/images/gas-tankW.png",
      submenu: [
        { name: "Mangueira de combustível", slug: "fuel-hose" },
        { name: "Conector rápido", slug: "quick-connector" },
        { name: "Limpa depósito", slug: "fuel-tank-cleaner" },
        { name: "Desferrujante depósito", slug: "fuel-tank-deruster" },
        { name: "Vedante depósito", slug: "fuel-tank-sealant" },
        { name: "Bomba de combustível", slug: "fuel-pump" }
      ]
    },
    {
      name: "Suspensão & Direção",
      slug: "suspension--steering",
      imageBlack: "/images/suspensionD.png",
      imageWhite: "/images/suspensionL.png",
      submenu: [
        { name: "Garfo dianteiro / Tubos do garfo", slug: "front-forks--fork-tubes" },
        { name: "Amortecedor / Amortecedor traseiro", slug: "shock-absorber--rear-shock" },
        { name: "Mesa de direção / Coluna de direção", slug: "triple-tree--steering-stem" },
        { name: "Rolamentos de direção", slug: "steering-bearings" }
      ]
    },
    {
      name: "Rodas & Pneus",
      slug: "wheels--tyres",
      imageBlack: "/images/wheelD.png",
      imageWhite: "/images/wheelL.png",
      submenu: [
        { name: "Aros / Rodas", slug: "rims--wheels" },
        { name: "Cubos & Raios", slug: "hubs--spokes" },
        { name: "Pneus (Dianteiro / Traseiro)", slug: "tires-front--rear" },
        { name: "Câmaras de ar", slug: "inner-tubes" },
        { name: "Eixo de roda / Espaçadores", slug: "wheel-axle--spacers" }
      ]
    },
    {
      name: "Quadro & Carenagem",
      slug: "frame--bodywork",
      imageBlack: "/images/bicycleD.png",
      imageWhite: "/images/bicycleL.png",
      submenu: [
        { name: "Quadro & Subquadro", slug: "frame--subframe" },
        { name: "Apoios de pé / Rearsets", slug: "footpegs--rearsets" },
        { name: "Carinagens / Painéis laterais", slug: "fairings--side-panels" },
        { name: "Banco & Capas de banco", slug: "seat--seat-covers" }
      ]
    },
    {
      name: "Escapamento",
      slug: "exhaust",
      imageBlack: "/images/mufflerD.png",
      imageWhite: "/images/mufflerL.png",
      submenu: [
        { name: "Sistemas de escapamento completos", slug: "complete-exhaust-systems" },
        { name: "Coletores / Tubos de escapamento", slug: "headers--downpipes" },
        { name: "Silenciosos / Mufflers", slug: "mufflers--silencers" },
        { name: "Abraçadeiras & Juntas do escapamento", slug: "exhaust-clamps--gaskets" }
      ]
    },
    {
      name: "Arrefecimento",
      slug: "cooling",
      imageBlack: "/images/radiatorD.png",
      imageWhite: "/images/radiatorL.png",
      submenu: [
        { name: "Radiador", slug: "radiator" },
        { name: "Tampa & Mangueiras do radiador", slug: "radiator-cap--hoses" },
        { name: "Bomba d'água", slug: "water-pump" }
      ]
    },
    {
      name: "Motor & Transmissão",
      slug: "engine--transmission",
      imageBlack: "/images/engineD.png",
      imageWhite: "/images/engineL.png",
      submenu: [
        { name: "Blocos do motor / Carter", slug: "engine-blocks--crankcases" },
        { name: "Pistões / Kits de cilindro", slug: "pistons--cylinder-kits" },
        { name: "Comando de válvulas / Peças do trem de válvulas", slug: "camshaft--valvetrain-parts" },
        { name: "Caixa de câmbio / Peças de transmissão", slug: "gearbox--transmission-parts" },
        { name: "Juntas & Vedantes", slug: "gaskets--seals" }
      ]
    },
    {
      name: "Elétrica",
      slug: "electric",
      imageBlack: "/images/wireB.png",
      imageWhite: "/images/wireW.png",
      submenu: [
        { name: "Regulador", slug: "regulator" },
        { name: "Motor de arranque", slug: "starter" },
        { name: "Alternador", slug: "alternator" },
        { name: "Carregador de bateria", slug: "battery-charger" },
        { name: "Vela de ignição", slug: "sparkplug" },
        { name: "Bateria", slug: "battery" },
        { name: "Limpa contactos", slug: "contact-cleaner" },
        { name: "Acessórios carregador de bateria", slug: "battery-charger-accessories" },
        { name: "Arrancador de bateria", slug: "battery-booster" },
        { name: "Fita", slug: "tape" },
        { name: "Cabo de vela", slug: "spark-plug-wire" },
        { name: "Cachimbo de vela", slug: "spark-plug-cap" },
        { name: "Bobina de ignição", slug: "ignition-coil" },
        { name: "Relé de piscas", slug: "flasher-relay" },
        { name: "Interruptor de embraiagem", slug: "clutch-switch" },
        { name: "Interruptor de luz de travão", slug: "brake-light-switch" },
        { name: "Relé de arranque", slug: "starter-relay" }
      ]
    },
    {
      name: "Filtros",
      slug: "filters",
      imageBlack: "/images/oil-filterB.png",
      imageWhite: "/images/oil-filterW.png",
      submenu: [
        { name: "Filtro de óleo", slug: "oil-filter" },
        { name: "Filtro de ar", slug: "air-filter" },
        { name: "Pack de manutenção", slug: "maintenance-package" },
        { name: "Filtro de combustível", slug: "fuel-filter" },
        { name: "Óleo de filtro de ar", slug: "air-filter-oil" },
        { name: "Limpa filtro de ar", slug: "air-filter-cleaner" }
      ]
    },
    {
      name: "Óleos & Fluidos",
      slug: "oil--fluids",
      imageBlack: "/images/engine-oilB.png",
      imageWhite: "/images/engine-oilW.png",
      submenu: [
        { name: "Líquido de refrigeração", slug: "engine-coolant" },
        { name: "Óleo de motor", slug: "engine-oil" },
        { name: "Fluido de embraiagem", slug: "clutch-fluid" },
        { name: "Óleo de suspensão", slug: "fork-oil" },
        { name: "Óleo de transmissão", slug: "transmission-oil" },
        { name: "Óleo 2 tempos", slug: "2-stroke-oil" },
        { name: "Tabuleiro de óleo", slug: "oil-collection-tray" },
        { name: "Óleo de amortecedor", slug: "shock-absorber-oil" }
      ]
    },
    {
      name: "Travões",
      slug: "brakes",
      imageBlack: "/images/disc-brakeB.png",
      imageWhite: "/images/disc-brakeW.png",
      submenu: [
        { name: "Fluido de travões", slug: "brake-fluid" },
        { name: "Disco de travão traseiro", slug: "brake-disc-rear" },
        { name: "Limpa travões", slug: "brake-cleaner" },
        { name: "Disco de travão dianteiro", slug: "brake-disc-front" },
        { name: "Pastilhas de travão", slug: "brake-pads" },
        { name: "Pack de manutenção", slug: "maintenance-package" },
        { name: "Sangrador de travões", slug: "brake-bleeder" },
        { name: "Kit reparação pinça", slug: "brake-caliper-repair-kit" },
        { name: "Kit reparação bomba de travão", slug: "brake-pump-repair-kit" },
        { name: "Massa para êmbolo de travão", slug: "brake-piston-grease" }
      ]
    },
    {
      name: "Guiador & Comandos",
      slug: "handlebar--controls",
      imageBlack: "/images/brakeB.png",
      imageWhite: "/images/brakeW.png",
      submenu: [
        { name: "Conjunto de espelhos", slug: "mirror-set" },
        { name: "Adaptador de espelho", slug: "mirror-adapter" },
        { name: "Suporte de espelho", slug: "mirror-holder" },
        { name: "Cabo do acelerador", slug: "throttle-cable" },
        { name: "Cabo da embraiagem", slug: "clutch-cable" },
        { name: "Manete de travão", slug: "brake-lever" },
        { name: "Manete de embraiagem", slug: "clutch-lever" },
        { name: "Espelho esquerdo", slug: "mirror-left" },
        { name: "Espelho direito", slug: "mirror-right" },
        { name: "Mangueira de travão", slug: "brake-line" }
      ]
    },
    {
      name: "Manutenção",
      slug: "maintenance",
      imageBlack: "/images/settingsB.png",
      imageWhite: "/images/settingsW.png",
      submenu: [
        { name: "Pasta de montagem", slug: "assembly-paste" },
        { name: "Spray de corrente", slug: "chain-spray" },
        { name: "Massa de lítio", slug: "lithium-grease" },
        { name: "Massa para rolamentos", slug: "bearing-grease" },
        { name: "Vedante líquido", slug: "liquid-gasket" },
        { name: "Parafuso de drenagem", slug: "drain-plug" },
        { name: "Multispray", slug: "multispray" },
        { name: "Limpa radiador", slug: "radiator-cleaner" },
        { name: "Limpa carburador", slug: "carburetor-cleaner" },
        { name: "Óleo penetrante", slug: "penetrating-oil" },
        { name: "Anilha de drenagem", slug: "drain-plug-washer" },
        { name: "Papel de juntas", slug: "gasket-paper" },
        { name: "Abraçadeiras", slug: "clamps" },
        { name: "Limpa óleo de motor", slug: "engine-oil-cleaner" },
        { name: "Limpa corrente", slug: "chain-cleaner" },
        { name: "Massa de molibdénio", slug: "molybdeen-grease" },
        { name: "Junta tampa alternador", slug: "alternator-cover-gasket" },
        { name: "Junta tampa embraiagem", slug: "clutch-cover-gasket" },
        { name: "Junta tampa válvulas", slug: "valve-cover-gasket" },
        { name: "Junta tampa primária", slug: "primary-cover-gasket" }
      ]
    },
    {
      name: "Kits de revisão",
      slug: "overhaul-kits",
      imageBlack: "/images/mechanic-toolsB.png",
      imageWhite: "/images/mechanic-toolsW.png",
      submenu: [
        { name: "Kit reparação carburador", slug: "carburettor-repair-kit" },
        { name: "Retentor de suspensão", slug: "front-fork-oil-seal" },
        { name: "Rolamento de roda", slug: "wheel-bearing" },
        { name: "Rolamento de direção", slug: "steering-bearing" },
        { name: "Juntas", slug: "gaskets" },
        { name: "Rolamento de braço oscilante", slug: "swingarm-bearing" },
        { name: "Kit reparação torneira de combustível", slug: "fuel-tap-repair-kit" },
        { name: "Rolamento de bieletas", slug: "link-system-bearing" },
        { name: "Rolamento de amortecedor", slug: "shock-absorber-bearing" },
        { name: "Kit reparação suspensão dianteira", slug: "front-fork-repair-kit" }
      ]
    },
  ]
},
{
  name: "PEÇAS USADAS",
  slug: "used-parts",
  kind: "category",
  submenu: [
    {
      name: "Transmissão",
      slug: "drivetrain",
      imageBlack: "/images/wheelB.png",
      imageWhite: "/images/wheelW.png",
      submenu: [
        { name: "Correntes", slug: "chains" },
        { name: "Pinhões", slug: "sprockets" },
        { name: "Protetor de corrente", slug: "chain-guard" },
        { name: "Kit corrente e pinhões", slug: "chain-and-sprockets-kit" },
        { name: "Sistema lubrificação de corrente", slug: "chain-oiler-system" },
        { name: "Ferramentas de corrente", slug: "chain-tools" },
        { name: "Embraiagem", slug: "clutch" },
        { name: "Disco de embraiagem", slug: "clutch-plate" }
      ]
    },
    {
      name: "Depósito de combustível",
      slug: "fuel-tank",
      imageBlack: "/images/gas-tankB.png",
      imageWhite: "/images/gas-tankW.png",
      submenu: [
        { name: "Mangueira de combustível", slug: "fuel-hose" },
        { name: "Conector rápido", slug: "quick-connector" },
        { name: "Limpa depósito", slug: "fuel-tank-cleaner" },
        { name: "Desferrujante depósito", slug: "fuel-tank-deruster" },
        { name: "Vedante depósito", slug: "fuel-tank-sealant" },
        { name: "Bomba de combustível", slug: "fuel-pump" }
      ]
    },
    {
      name: "Suspensão & Direção",
      slug: "suspension--steering",
      imageBlack: "/images/suspensionD.png",
      imageWhite: "/images/suspensionL.png",
      submenu: [
        { name: "Garfo dianteiro / Tubos do garfo", slug: "front-forks--fork-tubes" },
        { name: "Amortecedor / Amortecedor traseiro", slug: "shock-absorber--rear-shock" },
        { name: "Mesa de direção / Coluna de direção", slug: "triple-tree--steering-stem" },
        { name: "Rolamentos de direção", slug: "steering-bearings" }
      ]
    },
    {
      name: "Rodas & Pneus",
      slug: "wheels--tyres",
      imageBlack: "/images/wheelD.png",
      imageWhite: "/images/wheelL.png",
      submenu: [
        { name: "Aros / Rodas", slug: "rims--wheels" },
        { name: "Cubos & Raios", slug: "hubs--spokes" },
        { name: "Pneus (Dianteiro / Traseiro)", slug: "tires-front--rear" },
        { name: "Câmaras de ar", slug: "inner-tubes" },
        { name: "Eixo de roda / Espaçadores", slug: "wheel-axle--spacers" }
      ]
    },
    {
      name: "Quadro & Carenagem",
      slug: "frame--bodywork",
      imageBlack: "/images/bicycleD.png",
      imageWhite: "/images/bicycleL.png",
      submenu: [
        { name: "Quadro & Subquadro", slug: "frame--subframe" },
        { name: "Apoios de pé / Rearsets", slug: "footpegs--rearsets" },
        { name: "Carinagens / Painéis laterais", slug: "fairings--side-panels" },
        { name: "Banco & Capas de banco", slug: "seat--seat-covers" }
      ]
    },
    {
      name: "Escapamento",
      slug: "exhaust",
      imageBlack: "/images/mufflerD.png",
      imageWhite: "/images/mufflerL.png",
      submenu: [
        { name: "Sistemas de escapamento completos", slug: "complete-exhaust-systems" },
        { name: "Coletores / Tubos de escapamento", slug: "headers--downpipes" },
        { name: "Silenciosos / Mufflers", slug: "mufflers--silencers" },
        { name: "Abraçadeiras & Juntas do escapamento", slug: "exhaust-clamps--gaskets" }
      ]
    },
    {
      name: "Arrefecimento",
      slug: "cooling",
      imageBlack: "/images/radiatorD.png",
      imageWhite: "/images/radiatorL.png",
      submenu: [
        { name: "Radiador", slug: "radiator" },
        { name: "Tampa & Mangueiras do radiador", slug: "radiator-cap--hoses" },
        { name: "Bomba d'água", slug: "water-pump" }
      ]
    },
    {
      name: "Motor & Transmissão",
      slug: "engine--transmission",
      imageBlack: "/images/engineD.png",
      imageWhite: "/images/engineL.png",
      submenu: [
        { name: "Blocos do motor / Carter", slug: "engine-blocks--crankcases" },
        { name: "Pistões / Kits de cilindro", slug: "pistons--cylinder-kits" },
        { name: "Comando de válvulas / Peças do trem de válvulas", slug: "camshaft--valvetrain-parts" },
        { name: "Caixa de câmbio / Peças de transmissão", slug: "gearbox--transmission-parts" },
        { name: "Juntas & Vedantes", slug: "gaskets--seals" }
      ]
    },
    {
      name: "Elétrica",
      slug: "electric",
      imageBlack: "/images/wireB.png",
      imageWhite: "/images/wireW.png",
      submenu: [
        { name: "Regulador", slug: "regulator" },
        { name: "Motor de arranque", slug: "starter" },
        { name: "Alternador", slug: "alternator" },
        { name: "Carregador de bateria", slug: "battery-charger" },
        { name: "Vela de ignição", slug: "sparkplug" },
        { name: "Bateria", slug: "battery" },
        { name: "Limpa contactos", slug: "contact-cleaner" },
        { name: "Acessórios carregador de bateria", slug: "battery-charger-accessories" },
        { name: "Arrancador de bateria", slug: "battery-booster" },
        { name: "Fita", slug: "tape" },
        { name: "Cabo de vela", slug: "spark-plug-wire" },
        { name: "Cachimbo de vela", slug: "spark-plug-cap" },
        { name: "Bobina de ignição", slug: "ignition-coil" },
        { name: "Relé de piscas", slug: "flasher-relay" },
        { name: "Interruptor de embraiagem", slug: "clutch-switch" },
        { name: "Interruptor de luz de travão", slug: "brake-light-switch" },
        { name: "Relé de arranque", slug: "starter-relay" }
      ]
    },
    {
      name: "Filtros",
      slug: "filters",
      imageBlack: "/images/oil-filterB.png",
      imageWhite: "/images/oil-filterW.png",
      submenu: [
        { name: "Filtro de óleo", slug: "oil-filter" },
        { name: "Filtro de ar", slug: "air-filter" },
        { name: "Pack de manutenção", slug: "maintenance-package" },
        { name: "Filtro de combustível", slug: "fuel-filter" },
        { name: "Óleo de filtro de ar", slug: "air-filter-oil" },
        { name: "Limpa filtro de ar", slug: "air-filter-cleaner" }
      ]
    },
    {
      name: "Óleos & Fluidos",
      slug: "oil--fluids",
      imageBlack: "/images/engine-oilB.png",
      imageWhite: "/images/engine-oilW.png",
      submenu: [
        { name: "Líquido de refrigeração", slug: "engine-coolant" },
        { name: "Óleo de motor", slug: "engine-oil" },
        { name: "Fluido de embraiagem", slug: "clutch-fluid" },
        { name: "Óleo de suspensão", slug: "fork-oil" },
        { name: "Óleo de transmissão", slug: "transmission-oil" },
        { name: "Óleo 2 tempos", slug: "2-stroke-oil" },
        { name: "Tabuleiro de óleo", slug: "oil-collection-tray" },
        { name: "Óleo de amortecedor", slug: "shock-absorber-oil" }
      ]
    },
    {
      name: "Travões",
      slug: "brakes",
      imageBlack: "/images/disc-brakeB.png",
      imageWhite: "/images/disc-brakeW.png",
      submenu: [
        { name: "Fluido de travões", slug: "brake-fluid" },
        { name: "Disco de travão traseiro", slug: "brake-disc-rear" },
        { name: "Limpa travões", slug: "brake-cleaner" },
        { name: "Disco de travão dianteiro", slug: "brake-disc-front" },
        { name: "Pastilhas de travão", slug: "brake-pads" },
        { name: "Pack de manutenção", slug: "maintenance-package" },
        { name: "Sangrador de travões", slug: "brake-bleeder" },
        { name: "Kit reparação pinça", slug: "brake-caliper-repair-kit" },
        { name: "Kit reparação bomba de travão", slug: "brake-pump-repair-kit" },
        { name: "Massa para êmbolo de travão", slug: "brake-piston-grease" }
      ]
    },
    {
      name: "Guiador & Comandos",
      slug: "handlebar--controls",
      imageBlack: "/images/brakeB.png",
      imageWhite: "/images/brakeW.png",
      submenu: [
        { name: "Conjunto de espelhos", slug: "mirror-set" },
        { name: "Adaptador de espelho", slug: "mirror-adapter" },
        { name: "Suporte de espelho", slug: "mirror-holder" },
        { name: "Cabo do acelerador", slug: "throttle-cable" },
        { name: "Cabo da embraiagem", slug: "clutch-cable" },
        { name: "Manete de travão", slug: "brake-lever" },
        { name: "Manete de embraiagem", slug: "clutch-lever" },
        { name: "Espelho esquerdo", slug: "mirror-left" },
        { name: "Espelho direito", slug: "mirror-right" },
        { name: "Mangueira de travão", slug: "brake-line" }
      ]
    },
    {
      name: "Manutenção",
      slug: "maintenance",
      imageBlack: "/images/settingsB.png",
      imageWhite: "/images/settingsW.png",
      submenu: [
        { name: "Pasta de montagem", slug: "assembly-paste" },
        { name: "Spray de corrente", slug: "chain-spray" },
        { name: "Massa de lítio", slug: "lithium-grease" },
        { name: "Massa para rolamentos", slug: "bearing-grease" },
        { name: "Vedante líquido", slug: "liquid-gasket" },
        { name: "Parafuso de drenagem", slug: "drain-plug" },
        { name: "Multispray", slug: "multispray" },
        { name: "Limpa radiador", slug: "radiator-cleaner" },
        { name: "Limpa carburador", slug: "carburetor-cleaner" },
        { name: "Óleo penetrante", slug: "penetrating-oil" },
        { name: "Anilha de drenagem", slug: "drain-plug-washer" },
        { name: "Papel de juntas", slug: "gasket-paper" },
        { name: "Abraçadeiras", slug: "clamps" },
        { name: "Limpa óleo de motor", slug: "engine-oil-cleaner" },
        { name: "Limpa corrente", slug: "chain-cleaner" },
        { name: "Massa de molibdénio", slug: "molybdeen-grease" },
        { name: "Junta tampa alternador", slug: "alternator-cover-gasket" },
        { name: "Junta tampa embraiagem", slug: "clutch-cover-gasket" },
        { name: "Junta tampa válvulas", slug: "valve-cover-gasket" },
        { name: "Junta tampa primária", slug: "primary-cover-gasket" }
      ]
    },
    {
      name: "Kits de revisão",
      slug: "overhaul-kits",
      imageBlack: "/images/mechanic-toolsB.png",
      imageWhite: "/images/mechanic-toolsW.png",
      submenu: [
        { name: "Kit reparação carburador", slug: "carburettor-repair-kit" },
        { name: "Retentor de suspensão", slug: "front-fork-oil-seal" },
        { name: "Rolamento de roda", slug: "wheel-bearing" },
        { name: "Rolamento de direção", slug: "steering-bearing" },
        { name: "Juntas", slug: "gaskets" },
        { name: "Rolamento de braço oscilante", slug: "swingarm-bearing" },
        { name: "Kit reparação torneira de combustível", slug: "fuel-tap-repair-kit" },
        { name: "Rolamento de bieletas", slug: "link-system-bearing" },
        { name: "Rolamento de amortecedor", slug: "shock-absorber-bearing" },
        { name: "Kit reparação suspensão dianteira", slug: "front-fork-repair-kit" }
      ]
    },
  ]
},
{
  name: "ACESSÓRIOS",
  slug: "accessory",
  kind: "accessory",
  submenu: [
    {
      name: "Acessórios",
      slug: "accessories",
      imageBlack: "/images/gripB.png",
      imageWhite: "/images/gripW.png",
      submenu: [
        { name: "Punhos aquecidos", slug: "heated-grips" },
        { name: "Capa de mota", slug: "motorcycle-cover" },
        { name: "Cruise control", slug: "cruise-control" },
        { name: "Parafusos de viseira", slug: "windscreen-bolts" },
        { name: "Cola para punhos", slug: "grip-glue" },
        { name: "Brilho pneus", slug: "tyre-shine" },
        { name: "Base de descanso lateral", slug: "kickstand-pad" }
      ]
    },
    {
      name: "Bagagem",
      slug: "luggage",
      imageBlack: "/images/airpodsB.png",
      imageWhite: "/images/airpodsW.png",
      submenu: [
        { name: "Conjunto de malas", slug: "case-set" },
        { name: "Rede de carga", slug: "cargo-net" },
        { name: "Kit saco de viagem", slug: "travelbag-kit" },
        { name: "Top case", slug: "top-case" },
        { name: "Saco de depósito", slug: "tank-bag" },
        { name: "Mochila", slug: "backpack" },
        { name: "Saco rolo", slug: "luggage-roll" },
        { name: "Alforges", slug: "saddle-bag" },
        { name: "Suporte saco de depósito", slug: "tank-bag-mounting" },
        { name: "Conjunto de sacos", slug: "bag-set" },
        { name: "Saco esquerdo", slug: "bag-left" },
        { name: "Saco direito", slug: "bag-right" },
        { name: "Mala esquerda", slug: "suitcase-left" },
        { name: "Mala direita", slug: "suitcase-right" },
        { name: "Suporte de bagagem", slug: "luggage-rack" }
      ]
    },
    {
      name: "Combustível & Aditivos",
      slug: "fuel--additives",
      imageBlack: "/images/cosmeticB.png",
      imageWhite: "/images/cosmeticW.png",
      submenu: [
        { name: "Estabilizador", slug: "stabilizer" },
        { name: "Limpa", slug: "cleaner" },
        { name: "Potenciador de octanas", slug: "octane-booster" },
        { name: "Aditivo E10", slug: "e10-additive" },
        { name: "Combustível Ecomaxx", slug: "ecomaxx-fuel" }
      ]
    },
    {
      name: "Lavar & brilhar",
      slug: "wash--shine",
      imageBlack: "/images/sprayB.png",
      imageWhite: "/images/sprayW.png",
      submenu: [
        { name: "Spray assento", slug: "seat-spray" },
        { name: "Polish & cera", slug: "polish--wax" },
        { name: "Polish cromo & alumínio", slug: "chrome--alu-polish" },
        { name: "Produtos de limpeza", slug: "cleaning-supplies" },
        { name: "Escova", slug: "brush" },
        { name: "Esponja", slug: "sponge" },
        { name: "Pano de limpeza", slug: "cleaning-cloth" },
        { name: "Desengordurante", slug: "degreaser" },
        { name: "Proteção anticorrosão", slug: "corrosion-protection" },
        { name: "Kit de limpeza", slug: "cleaning-set" },
        { name: "Spray de cera", slug: "wax-spray" },
        { name: "Spray de silicone", slug: "silicone-spray" },
        { name: "Spray anti-insetos", slug: "bug-spray" },
        { name: "Limpa jantes", slug: "wheel-cleaner" },
        { name: "Tampa escape", slug: "exhaust-plug" }
      ]
    },
    {
      name: "Ferramentas",
      slug: "tools",
      imageBlack: "/images/clampB.png",
      imageWhite: "/images/clampW.png",
      submenu: [
        { name: "Chave filtro de óleo", slug: "oil-filter-wrench" },
        { name: "Chave de vela", slug: "spark-plug-wrench" },
        { name: "Ferramenta lubrificação cabos", slug: "cable-lubricator-tool" },
        { name: "Ferramentas suspensão", slug: "front-fork-tools" },
        { name: "Chave carburador", slug: "carburetor-screwdriver" },
        { name: "Testador de voltagem", slug: "voltage-tester" },
        { name: "Extrator de mola", slug: "spring-puller" },
        { name: "Raspador de juntas", slug: "gasket-scraper" },
        { name: "Estetoscópio mecânico", slug: "stethoscope" },
        { name: "Reparação de roscas", slug: "thread-repair" },
        { name: "Testador de sincronismo", slug: "synchronous-tester" },
        { name: "Sangrador de travões", slug: "brake-bleeder" },
        { name: "Manómetro de pneus", slug: "tire-pressure-gauge" },
        { name: "Ferramenta eixo roda dianteira", slug: "front-wheel-axle-tool" },
        { name: "Ferramentas de corrente", slug: "chain-tools" }
      ]
    },
    {
      name: "Equipamento de oficina",
      slug: "workshop-equipment",
      imageBlack: "/images/wrenchB.png",
      imageWhite: "/images/wrenchW.png",
      submenu: [
        { name: "Calço de roda", slug: "wheel-chock" },
        { name: "Cavalete de oficina", slug: "paddock-stand" },
        { name: "Elevador de motos", slug: "motorcycle-lift" },
        { name: "Funil", slug: "funnel" },
        { name: "Kit reparação pneus", slug: "tire-repair-kit" },
        { name: "Adaptador de cavalete", slug: "paddock-stand-adapter" },
        { name: "Caixas sortidas", slug: "assortment-boxes" },
        { name: "Régua magnética", slug: "magnetic-scale" },
        { name: "Jerrican", slug: "jerrycan" },
        { name: "Depósito auxiliar", slug: "auxiliary-fuel-tank" },
        { name: "Protetor de depósito", slug: "fuel-tank-protector" },
        { name: "Cinta de guiador", slug: "handlebar-harness" },
        { name: "Tabuleiro de óleo", slug: "oil-collection-tray" },
        { name: "Mordentes de torno", slug: "vice-jaws" },
        { name: "Limpa mãos", slug: "hand-cleaner" },
        { name: "Travador de roscas", slug: "threadlocker" },
        { name: "Cintas de fixação", slug: "tie-down-straps" },
        { name: "Luvas de oficina", slug: "workshop-glove" },
        { name: "Banco de mecânico", slug: "mechanics-bar-stool" },
        { name: "Manual de oficina", slug: "workshop-manual" }
      ]
    },
    {
      name: "Antirroubo",
      slug: "locks",
      imageBlack: "/images/lockB.png",
      imageWhite: "/images/lockW.png",
      submenu: [
        { name: "Cadeado de corrente", slug: "chain-lock" },
        { name: "Cadeado em U", slug: "u-lock" },
        { name: "Âncora chão/parede", slug: "ground-wall-anchor" },
        { name: "Acessório antirroubo", slug: "lock-accessory" },
        { name: "Trava disco", slug: "disc-brake-lock" },
        { name: "Cabo lembrete", slug: "lock-reminder" }
      ]
    },
    {
      name: "Equipamento de pilotagem",
      slug: "riding-gear",
      imageBlack: "/images/suitB.png",
      imageWhite: "/images/suitW.png",
      submenu: [
        { name: "Cuidado da roupa", slug: "clothing-care" },
        { name: "Pedal para crianças", slug: "pedal-for-kids" },
        { name: "Capacetes", slug: "helmets" },
        { name: "Luvas", slug: "gloves" },
        { name: "Jaquetas / Calças", slug: "jackets--pants" },
        { name: "Botas", slug: "boots" }
      ]
    },
    {
      name: "Navegação, Intercom & Telefone",
      slug: "navigation--intercom--telephone",
      imageBlack: "/images/automotiveB.png",
      imageWhite: "/images/automotiveW.png",
      submenu: [
        { name: "Intercom", slug: "intercom" },
        { name: "Suporte de telemóvel", slug: "phone-holder" },
        { name: "Suporte fixação telemóvel", slug: "phone-holder-mounting" },
        { name: "Acessórios suporte telemóvel", slug: "phone-holder-accessoires" },
        { name: "Sistema de navegação", slug: "navigation-system" },
        { name: "Rastreador GPS / Sistemas de alarme", slug: "gps-tracker--alarm-systems" }
      ]
    },
{
    name: "Motorcycles",
    slug: "motorcycles",
    submenu: [
      { name: "Moto Standard / Roadster", slug: "standard--roadster" },
      { name: "Cruiser", slug: "cruiser" },
      { name: "Moto Touring / Turismo", slug: "touring--grand-touring" },
      { name: "Sportbike / Superesportiva", slug: "sportbike--supersport" },
      { name: "Aventura / Dual-Sport", slug: "adventure--dual-sport" },
      { name: "Off-Road / Moto de Trilha", slug: "off-road--dirt-bike" },
      { name: "Motocross", slug: "motocross" },
      { name: "Enduro", slug: "enduro" },
      { name: "Café Racer", slug: "cafe-racer" },
      { name: "Bobber", slug: "bobber" },
      { name: "Chopper", slug: "chopper" },
      { name: "Scrambler", slug: "scrambler" },
      { name: "Flat Tracker", slug: "flat-tracker" },
      { name: "Naked", slug: "naked-bike" },
      { name: "Moto Elétrica", slug: "electric-motorcycle" },
      { name: "Mini Moto / Pocket Bike", slug: "mini-bike--pocket-bike" },
      { name: "Moto Militar", slug: "military-motorcycle" },
      { name: "Moto Policial", slug: "police-motorcycle" },
      { name: "Moto Vintage / Clássica", slug: "vintage--classic-motorcycle" }
    ]
  },
  {
    name: "Scooters",
    slug: "scooters",
    submenu: [
      { name: "Scooter Clássico", slug: "classic-scooter" },
      { name: "Scooter Moderno", slug: "modern-scooter" },
      { name: "Scooter Elétrico", slug: "electric-scooter" },
      { name: "Patinete Motorizado", slug: "kick-scooter-motorized" },
      { name: "Scooter de Três Rodas", slug: "three-wheeled-scooter-trike-style" },
      { name: "Scooter Step-Through", slug: "step-through-scooter" },
      { name: "Maxi Scooter", slug: "maxi-scooter" },
      { name: "Scooter Retrô / Vintage", slug: "retro--vintage-scooter" },
      { name: "Scooter de Entrega / Carga", slug: "delivery--cargo-scooter" }
    ]
  },
  {
    name: "Mopeds & Underbones",
    slug: "mopeds--underbones",
    submenu: [
      { name: "Moped Clássico (com pedal)", slug: "classic-moped-pedal-start" },
      { name: "Moped Moderno (automático)", slug: "modern-moped-automatic" },
      { name: "Underbone / Step-Through", slug: "step-through-underbone" },
      { name: "Moto estilo Cub (ex: Honda Super Cub)", slug: "cub-style-motorcycle" },
      { name: "Moto Leve 50–125cc", slug: "light-commuter-bike-50-125cc" }
    ]
  },
  {
    name: "Electric Two-Wheelers",
    slug: "electric-two-wheelers",
    submenu: [
      { name: "Moto Elétrica", slug: "electric-motorcycle" },
      { name: "Scooter Elétrico", slug: "electric-scooter" },
      { name: "Moped Elétrico", slug: "electric-moped" },
      { name: "Patinete Elétrico", slug: "electric-kick-scooter" },
      { name: "Moto Elétrica de Entrega", slug: "electric-delivery-bike" },
      { name: "Moto Híbrida", slug: "hybrid-two-wheeler" }
    ]
  },
  {
    name: "Off-Road & Competition Bikes",
    slug: "off-road--competition-bikes",
    submenu: [
      { name: "Moto de Motocross", slug: "motocross-bike" },
      { name: "Moto de Enduro", slug: "enduro-bike" },
      { name: "Moto de Trial", slug: "trials-bike" },
      { name: "Flat Track", slug: "flat-track-bike" },
      { name: "Supermoto", slug: "supermoto" },
      { name: "Moto Rally / Aventura", slug: "adventure--rally-bike" }
    ]
  },
  {
    name: "Special Purpose & Custom Bikes",
    slug: "special-purpose--custom-bikes",
    submenu: [
      { name: "Moto Custom", slug: "custom-motorcycle" },
      { name: "Bobber", slug: "bobber" },
      { name: "Chopper", slug: "chopper" },
      { name: "Café Racer", slug: "cafe-racer" },
      { name: "Tracker / Street Tracker", slug: "tracker--street-tracker" },
      { name: "Drag Bike", slug: "drag-bike" },
      { name: "Moto de Exposição / Show Bike", slug: "show-bike" }
    ]
  },
  {
    name: "Three-Wheeled & Other Variants",
    slug: "three-wheeled--other-variants",
    submenu: [
      { name: "Triciclo (Moto Trike)", slug: "trike-motorcycle" },
      { name: "Reverse Trike (duas rodas na frente)", slug: "reverse-trike-two-front-wheels" },
      { name: "Moto com Sidecar", slug: "sidecar-motorcycle" },
      { name: "Scooter Triciclo", slug: "scooter-trike" },
      { name: "Scooter de Mobilidade", slug: "mobility-scooter-motorized" }
    ]
  },
  {
    name: "Vintage & Classic Two-Wheelers",
    slug: "vintage--classic-two-wheelers",
    submenu: [
      { name: "Motos Pré-Guerra", slug: "pre-war-motorcycles" },
      { name: "Clássicas Pós-Guerra (1940–1960)", slug: "post-war-classics-1940s-1960s" },
      { name: "Retrô 1970–1980", slug: "1970s-1980s-retro-bikes" },
      { name: "Scooters Vintage (Vespa, Lambretta)", slug: "vintage-scooters-vespa-lambretta" },
      { name: "Mopeds Clássicos", slug: "classic-mopeds" }
    ]
  },
{
    name: "Signs & Displays",
    slug: "signs--displays",
    submenu: [
      { name: "Placas de Esmalte / Porcelana", slug: "enamel--porcelain-signs" },
      { name: "Placas de Estanho / Metal", slug: "tin--metal-signs" },
      { name: "Placas Néon / Iluminadas", slug: "neon--illuminated-signs" },
      { name: "Expositores de Madeira Pintada", slug: "painted-wood-displays" },
      { name: "Totens de Mostruário", slug: "showroom-counter-standees" },
      { name: "Placas Relevo / 3D", slug: "embossed--3d-relief-signs" },
      { name: "Faixas e Bandeiras de Vinil", slug: "vinyl-banners--flags" },
      { name: "Placas Direcionais ou Informativas", slug: "directional--informational-signs" }
    ]
  },
  {
    name: "Brand & Product Promo",
    slug: "brand--product-promo",
    submenu: [
      { name: "Chaveiros & Pins", slug: "keychains--pins" },
      { name: "Cinzeiros & Isqueiros de Concessionária", slug: "dealer-ashtrays--lighters" },
      { name: "Termômetros Promocionais", slug: "promotional-thermometers" },
      { name: "Relógios de Marca", slug: "branded-clocks" },
      { name: "Copos, Canecas & Itens de Bar", slug: "glassware-mugs--barware" },
      { name: "Fósforos & Canetas", slug: "matchbooks--pens" },
      { name: "Calendários & Blocos de Mesa", slug: "calendars--desk-pads" },
      { name: "Pesos de Papel & Réguas", slug: "paperweights--rulers" },
      { name: "Porta-copos, Guardanapos & Itens de Bar", slug: "coasters-napkins--bar-items" },
      { name: "Patches & Emblemas", slug: "patches--badges" }
    ]
  },
  {
    name: "Printed Advertising",
    slug: "printed-advertising",
    submenu: [
      { name: "Anúncios de Revista", slug: "magazine-advertisements" },
      { name: "Outdoor & Cartazes", slug: "billboards--posters" },
      { name: "Arte de Parede de Showroom", slug: "showroom-wall-art" },
      { name: "Folhetos & Panfletos", slug: "product-flyers--handouts" },
      { name: "Encarte de Jornal", slug: "newspaper-inserts" },
      { name: "Brochuras Publicitárias", slug: "advertising-brochures" },
      { name: "Livretos & Catálogos de Concessionária", slug: "dealer-booklets--catalogs" }
    ]
  },
  {
    name: "Dealer Marketing Materials",
    slug: "dealer-marketing-materials",
    submenu: [
      { name: "Plaquetas de Concessionária", slug: "dealer-nameplates" },
      { name: "Molduras de Placa", slug: "license-plate-frames" },
      { name: "Expositores de Ponto de Venda", slug: "point-of-sale-displays" },
      { name: "Suportes de Balcão de Showroom", slug: "showroom-counter-stands" },
      { name: "Placas de Concessionária Autorizada", slug: "authorized-dealer-signs" },
      { name: "Kits de Entrega de Carro Novo", slug: "new-car-delivery-kits" },
      { name: "Maletas de Amostras de Vendedores", slug: "salesmens-sample-cases" }
    ]
  },

  // 🔹 Garage & Workshop
  {
    name: "Tools & Devices",
    slug: "tools--devices",
    submenu: [
      { name: "Testadores de Vela", slug: "spark-plug-testers" },
      { name: "Manômetros de Compressão", slug: "compression-gauges" },
      { name: "Ferramentas de Assentar Válvulas", slug: "valve-grinders--lap-tools" },
      { name: "Luzes de Sincronismo", slug: "timing-lights" },
      { name: "Medidores Dwell & Testadores de Magneto", slug: "dwell-meters--magneto-testers" },
      { name: "Engraxadeiras", slug: "grease-guns" },
      { name: "Torquímetros", slug: "torque-wrenches" },
      { name: "Chaves Fixas & Estrela", slug: "open-end--box-wrenches" },
      { name: "Ferramentas com Marca", slug: "hand-tools-with-branding" }
    ]
  },
  {
    name: "Furniture & Fixtures",
    slug: "furniture--fixtures",
    submenu: [
      { name: "Bancadas", slug: "workbenches" },
      { name: "Carrinhos de Ferramentas", slug: "rolling-carts" },
      { name: "Gaveteiros & Armários de Ferramentas", slug: "tool-chests--cabinets" },
      { name: "Banquetas & Cadeiras de Garagem", slug: "garage-stools--chairs" },
      { name: "Prateleiras & Expositores", slug: "display-racks--shelving" },
      { name: "Relógios de Parede & Calendários", slug: "wall-clocks--calendars" }
    ]
  },
  {
    name: "Uniforms & Identity",
    slug: "uniforms--identity",
    submenu: [
      { name: "Macacões de Mecânico", slug: "mechanic-overalls" },
      { name: "Jaquetas de Oficina", slug: "workshop-jackets" },
      { name: "Bonés & Patches", slug: "caps--patches" },
      { name: "Crachás & Emblemas", slug: "name-tags--badges" },
      { name: "Aventais & Luvas", slug: "aprons--gloves" }
    ]
  },
  {
    name: "Workshop Paperwork",
    slug: "workshop-paperwork",
    submenu: [
      { name: "Manuais de Reparação", slug: "repair-manuals" },
      { name: "Boletins Técnicos de Serviço", slug: "technical-service-bulletins" },
      { name: "Diagramas Elétricos & Tabelas", slug: "wiring-diagrams--charts" },
      { name: "Notas & Faturas de Serviço", slug: "service-invoices--receipts" },
      { name: "Folhas de Ponto & Registros", slug: "timesheets--logs" }
    ]
  },

  // 🔹 Petroliana
  {
    name: "Fuel Pumps & Accessories",
    slug: "fuel-pumps--accessories",
    submenu: [
      { name: "Bombas Visíveis", slug: "visible-pumps" },
      { name: "Bombas de Mostrador (Clock-Face)", slug: "clock-face-pumps" },
      { name: "Bombas Computadas", slug: "computer-pumps" },
      { name: "Bicos & Manetes de Bomba", slug: "pump-nozzles--handles" },
      { name: "Placas & Emblemas de Bomba", slug: "pump-plates--badges" },
      { name: "Visores & Cúpulas", slug: "sight-glasses--domes" }
    ]
  },
  {
    name: "Oil & Lubricant Containers",
    slug: "oil--lubricant-containers",
    submenu: [
      { name: "Latas & Galões de Óleo", slug: "oil-cans--tins" },
      { name: "Garrafas de Óleo de Vidro", slug: "glass-oil-bottles" },
      { name: "Bicos de Enchimento", slug: "pouring-spouts" },
      { name: "Funis", slug: "funnels" },
      { name: "Latas de Graxa & Tambores", slug: "grease-tins--drums" },
      { name: "Suportes & Estantes de Óleo", slug: "oil-racks--stands" }
    ]
  },
  {
    name: "Station Equipment",
    slug: "station-equipment",
    submenu: [
      { name: "Medidores de Ar", slug: "air-meters" },
      { name: "Galões de Água", slug: "water-cans" },
      { name: "Extintores", slug: "fire-extinguishers" },
      { name: "Expositores de Pneus", slug: "tire-display-racks" },
      { name: "Uniformes & Bonés", slug: "uniforms--caps" },
      { name: "Lixeiras de Estação", slug: "station-trash-bins" }
    ]
  },

  // 🔹 Motorsport
  {
    name: "Event Materials",
    slug: "event-materials",
    submenu: [
      { name: "Programas de Corrida", slug: "race-programs" },
      { name: "Ingressos de Evento", slug: "event-tickets" },
      { name: "Credenciais & Passes", slug: "passes--credentials" },
      { name: "Cartazes de Corrida", slug: "race-posters" },
      { name: "Mapas & Resultados", slug: "maps--results-sheets" }
    ]
  },
  {
    name: "Awards & Recognition",
    slug: "awards--recognition",
    submenu: [
      { name: "Troféus & Medalhas", slug: "trophies--medals" },
      { name: "Placas Comemorativas", slug: "commemorative-plaques" },
      { name: "Prêmios de Clube", slug: "club-awards" },
      { name: "Moedas & Pins", slug: "coins--pins" }
    ]
  },
  {
    name: "Model & Replica Collectibles",
    slug: "model--replica-collectibles",
    submenu: [
      { name: "Miniaturas Die-cast", slug: "die-cast-race-cars" },
      { name: "Modelos de Resina", slug: "resin-models" },
      { name: "Autoramas & Trilhos", slug: "slot-cars--track-pieces" },
      { name: "Mini Capacetes de Corrida", slug: "racing-helmets-miniatures" }
    ]
  },

  // 🔹 Vehicle Parts
  {
    name: "Interior & Dashboard",
    slug: "interior--dashboard",
    submenu: [
      { name: "Volantes", slug: "steering-wheels" },
      { name: "Manetes de Câmbio", slug: "gear-knobs" },
      { name: "Medidores & Velocímetros", slug: "dash-gauges--speedometers" },
      { name: "Rádios & Grades Acústicas", slug: "radios--speaker-grilles" },
      { name: "Chaves & Botões de Buzina", slug: "ignition-keys--horn-buttons" }
    ]
  },
  {
    name: "Mechanical Pieces",
    slug: "mechanical-pieces",
    submenu: [
      { name: "Carburadores", slug: "carburetors" },
      { name: "Pistões & Válvulas", slug: "pistons--valves" },
      { name: "Virabrequins & Bielas", slug: "crankshafts--connecting-rods" },
      { name: "Velas & Distribuidores", slug: "spark-plugs--distributors" },
      { name: "Coletor & Ponteiras de Escape", slug: "exhaust-manifolds--tips" }
    ]
  },

  // 🔹 Motorcycle
  {
    name: "Parts & Accessories",
    slug: "parts--accessories",
    submenu: [
      { name: "Faróis & Velocímetros", slug: "headlights--speedometers" },
      { name: "Tampas de Tanque & Emblemas", slug: "tank-caps--badges" },
      { name: "Pedaleiras de Arranque", slug: "kickstarters--pedals" },
      { name: "Protetores de Corrente & Coroas", slug: "chain-guards--sprockets" },
      { name: "Espelhos & Piscas", slug: "mirrors--turn-signals" }
    ]
  },

  // 🔹 Artwork
  {
    name: "Sculpture & Design Objects",
    slug: "sculpture--design-objects",
    submenu: [
      { name: "Esculturas de Mesa em Bronze", slug: "bronze-desk-sculptures" },
      { name: "Mini Motores", slug: "miniature-engines" },
      { name: "Esculturas de Roda & Pistão", slug: "wheel--piston-sculptures" },
      { name: "Estátuas & Medalhões", slug: "award-statues--medallions" }
    ]
  },
  {
    name: "Decor & Furniture",
    slug: "decor--furniture",
    submenu: [
      { name: "Mesas Feitas de Motores", slug: "tables-made-from-engines" },
      { name: "Lâmpadas Feitas de Pistões", slug: "lamps-made-from-pistons" },
      { name: "Relógios Feitos de Calotas", slug: "wall-clocks-from-hubcaps" },
      { name: "Banquetas & Cadeiras", slug: "bar-stools--chairs" }
    ]
  },

  // 🔹 Clothing
  {
    name: "Racing Apparel",
    slug: "racing-apparel",
    submenu: [
      { name: "Macacões de Corrida", slug: "racing-suits" },
      { name: "Camisas de Equipe", slug: "team-shirts" },
      { name: "Uniformes de Box", slug: "pit-crew-uniforms" },
      { name: "Bonés & Jaquetas de Marca", slug: "branded-caps--jackets" }
    ]
  },
  {
    name: "Casual Collectibles",
    slug: "casual-collectibles",
    submenu: [
      { name: "Camisetas Promocionais", slug: "promotional-t-shirts" },
      { name: "Lenços & Gravatas", slug: "scarves--ties" },
      { name: "Pins & Abotoaduras", slug: "lapel-pins--cufflinks" },
      { name: "Relógios & Chaveiros", slug: "watches--key-fobs" }
    ]
  },

  // 🔹 Film & Pop Culture
  {
    name: "Sound & Media",
    slug: "sound--media",
    submenu: [
      { name: "Discos de Vinil", slug: "vinyl-records" },
      { name: "CDs & K7", slug: "cds--cassettes" },
      { name: "Trilhas Sonoras de Filmes", slug: "movie-soundtracks" },
      { name: "Press Kits & Materiais Promocionais", slug: "press-kits--promo-materials" }
    ]
  },
  {
    name: "Pop Culture Crossovers",
    slug: "pop-culture-crossovers",
    submenu: [
      { name: "Hot Wheels & Matchbox", slug: "hot-wheels--matchbox" },
      { name: "Jogos de Videogame Licenciados", slug: "branded-video-games" },
      { name: "Réplicas de Carros de Filmes", slug: "movie-car-replicas" },
      { name: "Quadrinhos & Graphic Novels", slug: "comics--graphic-novels" }
    ]
  }
    ]
},
];

async function collectionExists(handle) {
  const url = `${SHOP}/admin/api/${API_VERSION}/custom_collections.json?handle=${handle}`;

  const res = await fetch(url, {
    headers: { "X-Shopify-Access-Token": TOKEN }
  });

  if (!res.ok) return false;

  const json = await res.json();
  return json.custom_collections?.length > 0;
}


/*

async function createCollection({title, handle}) {
   if (await collectionExists(handle)) {
    console.log(`⚠️  Skipped: "${title}" (handle already exists: ${handle})`);
    return;
  }

  const url = `${SHOP}/admin/api/${API_VERSION}/custom_collections.json`;

  const body = {
    custom_collection: {
      title,
      handle,
      published: true
    }
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': TOKEN
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create "${title}": ${text}`);
  }

  const json = await res.json();
  console.log(`✅ Created collection: ${json.custom_collection.title} (id: ${json.custom_collection.id})`);
}

// Main: loop through every submenu name and create a collection
(async () => {
  for (const category of categories) {
    for (const item of category.submenu) {
      for (const submenuitem of item.submenu) {
      await createCollection({
        title: submenuitem.name,   // visible collection name
        handle: submenuitem.slug   // slug from submenu
      });
      await sleep(800);
    }
  }
  }
})();

*/

async function fetchAllCollections() {
  let all = [];
  let pageInfo = null;
  const base = `${SHOP}/admin/api/${API_VERSION}/custom_collections.json?limit=250&fields=id,handle,title,created_at`; 

  while (true) {
    const url = pageInfo ? `${base}&page_info=${pageInfo}` : base;
    const res = await fetch(url, {
      headers: {
        "X-Shopify-Access-Token": TOKEN,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`Failed to fetch collections: ${text}`);
    }

    const data = await res.json();
    all.push(...data.custom_collections);

    const link = res.headers.get("link");
    if (!link || !link.includes('rel="next"')) break;

    const match = link.match(/<([^>]+)>;\s*rel="next"/);
    if (!match) break;
    pageInfo = new URL(match[1]).searchParams.get("page_info");
  }

  return all;
}

function normalize(str = "") {
  return str.toLowerCase().trim();
}

function groupDuplicatesByTitle(collections) {
  const grouped = {};
  for (const c of collections) {
    const key = normalize(c.title);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(c);
  }
  return Object.entries(grouped).filter(([_, group]) => group.length > 1);
}

async function deleteCollection(id) {
  const url = `${SHOP}/admin/api/${API_VERSION}/custom_collections/${id}.json`;
  const res = await fetch(url, {
    method: "DELETE",
    headers: { "X-Shopify-Access-Token": TOKEN },
  });
  return res.ok;
}

async function confirmAndDelete(dupes) {
  if (dupes.length === 0) {
    console.log("\n✅ No duplicate collections found!");
    return;
  }

  console.log(`\n⚠️ Found ${dupes.length} duplicate title groups:\n`);
  dupes.forEach(([title, group]) => {
    console.log(`🔁 "${title}" has ${group.length} collections:`);
    group.forEach(c => {
      console.log(`   - ID ${c.id}, handle: ${c.handle}, created: ${c.created_at}`);
    });
  });

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  rl.question("\n⚠️  Do you want to delete duplicates (keeping the oldest)? (yes/no) ", async answer => {
    if (answer.toLowerCase() === "yes") {
      for (const [title, group] of dupes) {
        // sort by created_at (oldest first)
        group.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        const keep = group[0];
        const toDelete = group.slice(1);

        console.log(`\nKeeping oldest "${title}" (ID ${keep.id})`);
        for (const d of toDelete) {
          const ok = await deleteCollection(d.id);
          console.log(ok ? `🗑️  Deleted ${title} (ID ${d.id})` : `❌ Failed to delete ID ${d.id}`);
        }
      }
    } else {
      console.log("❎ Deletion cancelled.");
    }
    rl.close();
  });
}

(async () => {
  try {
    console.log("🔍 Fetching all collections...");
    const collections = await fetchAllCollections();
    console.log(`✅ Total fetched: ${collections.length}`);

    const dupes = groupDuplicatesByTitle(collections);
    await confirmAndDelete(dupes);
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();

/*

const endpoint = `${SHOP}/admin/api/${API_VERSION}/graphql.json`;


async function graphql(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error("GraphQL errors:", JSON.stringify(json.errors, null, 2));
  }
  if (json.data?.metaobjectDelete?.userErrors?.length) {
    console.error("User errors:", json.data.metaobjectDelete.userErrors);
  }
  return json;
}

async function deleteAllModels() {
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    // Step 1 – fetch models
    const query = `
      query getAllModels($cursor: String) {
        metaobjects(type: "model", first: 50, after: $cursor) {
          edges {
            node { id handle }
          }
          pageInfo { hasNextPage endCursor }
        }
      }
    `;

    const { data } = await graphql(query, { cursor });
    const edges = data.metaobjects.edges;

    // Step 2 – delete each model
    for (const edge of edges) {
      const id = edge.node.id;
      console.log("🗑 Deleting model:", id);

      const mutation = `
        mutation deleteModel($id: ID!) {
          metaobjectDelete(id: $id) {
            deletedId
            userErrors { field message }
          }
        }
      `;
      await graphql(mutation, { id });
    }

    hasNextPage = data.metaobjects.pageInfo.hasNextPage;
    cursor = data.metaobjects.pageInfo.endCursor;
  }
}

deleteAllModels().catch(console.error);

*/

/*const endpoint = `${SHOP}/admin/api/${API_VERSION}/graphql.json`;

async function graphql(query, variables = {}) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) {
    console.error("GraphQL Errors:", JSON.stringify(json.errors, null, 2));
  }
  return json;
}

// --- Paginated fetch ---
async function fetchAll(type) {
  let results = [];
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const query = `
      query GetMetaobjects($cursor: String) {
        metaobjects(first: 250, type: "${type}", after: $cursor) {
          edges {
            cursor
            node {
              id
              handle
              fields { key value }
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;

    const { data } = await graphql(query, { cursor });
    const { edges, pageInfo } = data.metaobjects;

    results.push(...edges.map((e) => e.node));
    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }

  return results;
}

// --- Main runner ---
async function run() {
  console.log("Fetching brands...");
  const brands = await fetchAll("brand");

  console.log("Fetching models...");
  const models = await fetchAll("model");

  // Build brand dictionary
  const brandMap = {};

  for (const brand of brands) {
    const nameField = brand.fields.find((f) => f.key === "name")?.value;
    brandMap[nameField] = {
      handle: brand.handle,
      models: [],
    };
  }

  for (const model of models) {
    const nameField = model.fields.find((f) => f.key === "name")?.value;
    const brandField = model.fields.find((f) => f.key === "brand")?.value; // will be brandId

    if (!brandField || !nameField) continue;

    console.log("fetched model", model)

    // Find brand by ID
    const brandEntry = Object.entries(brands).find(
      ([, b]) => b.id === brandField
    );

    if (brandEntry) {
      const brandName = brandEntry[1].fields.find((f) => f.key === "name").value;
      console.log("-----fetched brand", brandName)
      brandMap[brandName].models.push({
        name: nameField,
        handle: model.handle,
      });
    }
  }

  fs.writeFileSync("./brands_models.json", JSON.stringify(brandMap, null, 2));
  console.log("✅ Exported to brands_models.json");
}

run().catch(console.error);




const brandsModels = JSON.parse(fs.readFileSync("./brands_models.json", "utf8"));

const endpoint  = `${SHOP}/admin/api/${API_VERSION}/graphql.json`;

async function graphql(query, variables = {}) {
  
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors || json.data?.metaobjectCreate?.userErrors?.length) {
    console.error(JSON.stringify(json, null, 2));
  }
  return json;
}

async function getDefinitions() {
  const query = `
    {
      brandDef: metaobjectDefinitionByType(type: "brand") {
        id
        type
        name
        fieldDefinitions { key name }
      }
      modelDef: metaobjectDefinitionByType(type: "model") {
        id
        type
        name
        fieldDefinitions { key name }
      }
    }
  `;
  const { data } = await graphql(query);
  return {
    brandDef: data.brandDef,
    modelDef: data.modelDef,
  };
}

async function createBrand(handle, brandKey) {
  const mutation = `
    mutation createBrand($brandKey: String!, $value: String!) {
      metaobjectCreate(
        metaobject: {
          type: "brand"
          fields: [{ key: $brandKey, value: $value }]
        }
      ) {
        metaobject { id handle }
        userErrors { field message }
      }
    }
  `;
  const variables = { brandKey, value: handle };
  const data = await graphql(mutation, variables);
  return data.data?.metaobjectCreate?.metaobject?.id;
}

async function createModel(handle, brandId, modelKey, brandRefKey) {
  const mutation = `
    mutation createModel($modelKey: String!, $brandRefKey: String!, $handleVal: String!, $brandId: String!) {
      metaobjectCreate(
        metaobject: {
          type: "model"
          fields: [
            { key: $modelKey, value: $handleVal }
            { key: $brandRefKey, value: $brandId }
          ]
        }
      ) {
        metaobject { id handle }
        userErrors { field message }
      }
    }
  `;
  const variables = {
    modelKey,
    brandRefKey,
    handleVal: handle,
    brandId: brandId.toString(),
  };
  return graphql(mutation, variables);
}

async function run() {
  const { brandDef, modelDef } = await getDefinitions();

  // Just use "name" since that's the actual field key
  const brandKey = brandDef.fieldDefinitions.find(f => f.key === "name")?.key;
  const modelKey = modelDef.fieldDefinitions.find(f => f.key === "name")?.key;
  const brandRefKey = modelDef.fieldDefinitions.find(f => f.key === "brand")?.key;

  console.log("ℹ️ Using keys:", { brandKey, modelKey, brandRefKey });

  for (const [brandName, brandData] of Object.entries(brandsModels)) {
    console.log(`➡️ Creating brand: ${brandData.handle}`);
    const brandId = await createBrand(brandData.handle, brandKey);

    if (brandId) {
      for (const model of brandData.models) {
        console.log(`   ↳ Creating model: ${model.handle}`);
        await createModel(model.handle, brandId, modelKey, brandRefKey);
      }
    }
  }
}

run().catch(console.error);


/*

const endpoint  = `${SHOP}/admin/api/${API_VERSION}/graphql.json`;

async function shopifyFetch(query, variables = {}) {
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  const result = await response.json();
  if (result.errors) {
    console.error("GraphQL errors:", result.errors);
  }
  return result.data;
}

// 🔹 1. Fetch products with brand/model references
async function getProducts(cursor = null) {
  const query = `
    query GetProducts($cursor: String) {
  products(first: 50, after: $cursor) {
    edges {
      cursor
      node {
        id
        title
        metafield_brand: metafield(namespace: "custom", key: "brand") {
          reference {
            ... on Metaobject {
              field(key: "name") {
                value
              }
            }
          }
        }
        metafield_model: metafield(namespace: "custom", key: "model") {
          reference {
            ... on Metaobject {
              field(key: "name") {
                value
              }
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
    }
  }
}
  `;

  const data = await shopifyFetch(query, { cursor });
  return data.products;
}

// 2. Write brand_name / model_name back to product metafields
async function setProductNames(productId, brandName, modelName) {
  const metafields = [];

  if (brandName) {
    metafields.push({
      ownerId: productId,
      namespace: "custom",
      key: "brand_name",
      type: "single_line_text_field",
      value: brandName,
    });
  }

  if (modelName) {
    metafields.push({
      ownerId: productId,
      namespace: "custom",
      key: "model_name",
      type: "single_line_text_field",
      value: modelName,
    });
  }

  if (metafields.length === 0) return;

  const mutation = `
    mutation metafieldsSet($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields {
          id
          namespace
          key
          value
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  await shopifyFetch(mutation, { metafields });
  console.log(`✅ Updated product ${productId} → brand: ${brandName || "N/A"} | model: ${modelName || "N/A"}`);
}

// 3. Main runner
async function run() {
  let cursor = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const products = await getProducts(cursor);

    for (const edge of products.edges) {
      const product = edge.node;

      console.log("PRODUCT", product)

      const brandField = product.metafield_brand;
      const modelField = product.metafield_model;

      console.log("BRANDFIELD", brandField)
      console.log("modelField", modelField)


      const brandName = product.metafield_brand?.reference?.field?.value || null;
      const modelName = product.metafield_model?.reference?.field?.value || null;

      await setProductNames(product.id, brandName, modelName);
    }

    hasNextPage = products.pageInfo.hasNextPage;
    cursor = products.edges.at(-1)?.cursor;
  }
}

run().catch(console.error);

*/
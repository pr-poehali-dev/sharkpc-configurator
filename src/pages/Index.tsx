import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';

// Types
interface PCComponent {
  id: string;
  name: string;
  price: number;
  image?: string;
  specs: Record<string, string>;
  category: ComponentCategory;
  socket?: string;
  powerConsumption?: number;
  formFactor?: string;
}

type ComponentCategory = 'cpu' | 'gpu' | 'motherboard' | 'ram' | 'storage' | 'psu' | 'case';

interface PCBuild {
  id: string;
  name: string;
  author: string;
  likes: number;
  components: Partial<Record<ComponentCategory, PCComponent>>;
  totalPrice: number;
  createdAt: Date;
}

// Mock data
const mockComponents: Record<ComponentCategory, PCComponent[]> = {
  cpu: [
    {
      id: '1',
      name: 'Intel Core i9-13900K',
      price: 45990,
      category: 'cpu',
      socket: 'LGA1700',
      powerConsumption: 125,
      specs: { cores: '24', threads: '32', frequency: '3.0 GHz', turboFreq: '5.8 GHz' }
    },
    {
      id: '2',
      name: 'AMD Ryzen 9 7900X',
      price: 39990,
      category: 'cpu',
      socket: 'AM5',
      powerConsumption: 170,
      specs: { cores: '12', threads: '24', frequency: '4.7 GHz', turboFreq: '5.6 GHz' }
    }
  ],
  gpu: [
    {
      id: '3',
      name: 'RTX 4090',
      price: 159990,
      category: 'gpu',
      powerConsumption: 450,
      specs: { memory: '24GB GDDR6X', coreClock: '2230 MHz', memorySpeed: '21 Gbps' }
    },
    {
      id: '4',
      name: 'RTX 4080',
      price: 119990,
      category: 'gpu',
      powerConsumption: 320,
      specs: { memory: '16GB GDDR6X', coreClock: '2210 MHz', memorySpeed: '22.4 Gbps' }
    }
  ],
  motherboard: [
    {
      id: '5',
      name: 'ASUS ROG Strix Z790-E',
      price: 34990,
      category: 'motherboard',
      socket: 'LGA1700',
      formFactor: 'ATX',
      specs: { socket: 'LGA1700', chipset: 'Z790', ramSlots: '4', maxRam: '128GB' }
    },
    {
      id: '6',
      name: 'MSI MAG X670E Tomahawk',
      price: 29990,
      category: 'motherboard',
      socket: 'AM5',
      formFactor: 'ATX',
      specs: { socket: 'AM5', chipset: 'X670E', ramSlots: '4', maxRam: '128GB' }
    }
  ],
  ram: [
    {
      id: '7',
      name: 'G.SKILL Trident Z5 32GB',
      price: 12990,
      category: 'ram',
      powerConsumption: 10,
      specs: { capacity: '32GB', type: 'DDR5', speed: '6000 MHz', latency: 'CL30' }
    }
  ],
  storage: [
    {
      id: '8',
      name: 'Samsung 980 PRO 2TB',
      price: 15990,
      category: 'storage',
      powerConsumption: 7,
      specs: { capacity: '2TB', type: 'NVMe SSD', readSpeed: '7000 MB/s', writeSpeed: '5100 MB/s' }
    }
  ],
  psu: [
    {
      id: '9',
      name: 'Corsair RM1000x',
      price: 16990,
      category: 'psu',
      powerConsumption: -1000,
      specs: { wattage: '1000W', efficiency: '80+ Gold', modular: 'Fully Modular' }
    },
    {
      id: '10',
      name: 'Seasonic Focus GX-850',
      price: 12990,
      category: 'psu',
      powerConsumption: -850,
      specs: { wattage: '850W', efficiency: '80+ Gold', modular: 'Fully Modular' }
    }
  ],
  case: [
    {
      id: '11',
      name: 'Fractal Design Meshify C',
      price: 8990,
      category: 'case',
      formFactor: 'ATX',
      specs: { type: 'Mid Tower', maxGpuLength: '315mm', maxCpuHeight: '170mm' }
    }
  ]
};

const mockBuilds: PCBuild[] = [
  {
    id: '1',
    name: 'Геймерский Монстр 4K',
    author: 'ProGamer2024',
    likes: 142,
    totalPrice: 299990,
    createdAt: new Date(),
    components: {
      cpu: mockComponents.cpu[0],
      gpu: mockComponents.gpu[0],
      motherboard: mockComponents.motherboard[0],
      ram: mockComponents.ram[0],
      storage: mockComponents.storage[0],
      psu: mockComponents.psu[0],
      case: mockComponents.case[0]
    }
  }
];

const categoryNames: Record<ComponentCategory, string> = {
  cpu: 'Процессор',
  gpu: 'Видеокарта',
  motherboard: 'Материнская плата',
  ram: 'Оперативная память',
  storage: 'Накопитель',
  psu: 'Блок питания',
  case: 'Корпус'
};

const categoryIcons: Record<ComponentCategory, string> = {
  cpu: 'Cpu',
  gpu: 'Zap',
  motherboard: 'CircuitBoard',
  ram: 'MemoryStick',
  storage: 'HardDrive',
  psu: 'Battery',
  case: 'Box'
};

const Index = () => {
  const [activeTab, setActiveTab] = useState('configurator');
  const [selectedComponents, setSelectedComponents] = useState<Partial<Record<ComponentCategory, PCComponent>>>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMarketplace, setSelectedMarketplace] = useState('all');
  const [builds] = useState(mockBuilds);
  const { toast } = useToast();

  const addComponent = useCallback((component: PCComponent) => {
    setSelectedComponents(prev => ({
      ...prev,
      [component.category]: component
    }));
    toast({
      title: 'Компонент добавлен',
      description: `${component.name} добавлен в конфигурацию`,
    });
  }, [toast]);

  const removeComponent = useCallback((category: ComponentCategory) => {
    setSelectedComponents(prev => {
      const updated = { ...prev };
      delete updated[category];
      return updated;
    });
  }, []);

  const checkCompatibility = useCallback(() => {
    const issues: string[] = [];
    const { cpu, motherboard, gpu, psu } = selectedComponents;

    // Check CPU and Motherboard socket compatibility
    if (cpu && motherboard && cpu.socket !== motherboard.socket) {
      issues.push(`Процессор не подходит к материнской плате (${cpu.socket} ≠ ${motherboard.socket})`);
    }

    // Check power consumption
    const totalPowerConsumption = Object.values(selectedComponents)
      .reduce((total, component) => total + (component?.powerConsumption || 0), 0);
    
    const psuWattage = psu?.powerConsumption ? Math.abs(psu.powerConsumption) : 0;
    if (psuWattage > 0 && totalPowerConsumption > psuWattage * 0.8) {
      issues.push(`Блок питания слишком слабый (нужно ${Math.ceil(totalPowerConsumption * 1.2)}W, есть ${psuWattage}W)`);
    }

    // Check GPU clearance (mock check)
    if (gpu && selectedComponents.case) {
      issues.push('Видеокарта может не поместиться в корпус');
    }

    if (issues.length === 0) {
      toast({
        title: '✅ Совместимость проверена',
        description: 'Все компоненты совместимы!',
      });
    } else {
      toast({
        title: '⚠️ Обнаружены проблемы',
        description: issues.join('. '),
        variant: 'destructive',
      });
    }
  }, [selectedComponents, toast]);

  const getTotalPrice = () => {
    return Object.values(selectedComponents)
      .reduce((total, component) => total + (component?.price || 0), 0);
  };

  const findPCsOnMarketplaces = () => {
    toast({
      title: '🔍 Поиск ПК',
      description: `Ищем компьютеры на ${selectedMarketplace === 'all' ? 'всех маркетплейсах' : selectedMarketplace}...`,
    });
  };

  const ComponentSelector = ({ category }: { category: ComponentCategory }) => {
    const components = mockComponents[category] || [];
    const filteredComponents = components.filter(comp =>
      comp.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-gaming-purple bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-gaming-gradient">
                    <Icon name={categoryIcons[category]} className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{categoryNames[category]}</h3>
                    {selectedComponents[category] ? (
                      <p className="text-sm text-muted-foreground">{selectedComponents[category]!.name}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">Не выбрано</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  {selectedComponents[category] && (
                    <p className="font-bold text-gaming-purple">
                      {selectedComponents[category]!.price.toLocaleString()} ₽
                    </p>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1 text-gaming-purple hover:bg-gaming-purple/10"
                  >
                    {selectedComponents[category] ? 'Изменить' : 'Выбрать'}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold bg-gaming-gradient bg-clip-text text-transparent">
              Выбор: {categoryNames[category]}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Поиск компонентов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border-gaming-purple/30 focus:border-gaming-purple"
            />
            <div className="grid gap-4 max-h-96 overflow-y-auto">
              {filteredComponents.map(component => (
                <Card key={component.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-2">{component.name}</h4>
                        <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                          {Object.entries(component.specs).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="capitalize">{key}:</span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-2xl font-bold text-gaming-purple mb-2">
                          {component.price.toLocaleString()} ₽
                        </p>
                        <Button
                          onClick={() => addComponent(component)}
                          className="bg-gaming-gradient hover:opacity-90 text-white font-semibold"
                        >
                          Выбрать
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <div className="min-h-screen bg-dark-gradient">
      {/* Header */}
      <div className="bg-gaming-gradient text-white py-12">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4 animate-glow">🦈 SharkPc</h1>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              Мощный конфигуратор ПК с поиском на реальных маркетплейсах
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-slate-800/50 border border-gaming-purple/30">
            <TabsTrigger value="home" className="data-[state=active]:bg-gaming-purple data-[state=active]:text-white">
              <Icon name="Home" className="mr-2 h-4 w-4" />
              Главная
            </TabsTrigger>
            <TabsTrigger value="configurator" className="data-[state=active]:bg-gaming-purple data-[state=active]:text-white">
              <Icon name="Settings" className="mr-2 h-4 w-4" />
              Конфигуратор
            </TabsTrigger>
            <TabsTrigger value="builds" className="data-[state=active]:bg-gaming-purple data-[state=active]:text-white">
              <Icon name="Users" className="mr-2 h-4 w-4" />
              Сборки
            </TabsTrigger>
          </TabsList>

          {/* Home Tab */}
          <TabsContent value="home">
            <Card className="text-center py-12 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-gaming-purple/30">
              <CardContent>
                <Icon name="Rocket" className="h-16 w-16 mx-auto mb-4 text-gaming-purple" />
                <h2 className="text-3xl font-bold mb-4 text-gaming-purple">Добро пожаловать в SharkPc!</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Скоро здесь будет приветственная страница с гидами и новинками
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurator Tab */}
          <TabsContent value="configurator" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-2xl font-bold text-white mb-4">Выберите компоненты</h2>
                <div className="grid gap-4">
                  {(Object.keys(categoryNames) as ComponentCategory[]).map(category => (
                    <ComponentSelector key={category} category={category} />
                  ))}
                </div>
              </div>

              {/* Configuration Summary */}
              <div className="space-y-6">
                <Card className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-gaming-purple/30">
                  <CardHeader>
                    <CardTitle className="text-gaming-purple">Ваша конфигурация</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold text-gaming-purple">
                      {getTotalPrice().toLocaleString()} ₽
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      {Object.entries(selectedComponents).map(([category, component]) => (
                        <div key={category} className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">
                            {categoryNames[category as ComponentCategory]}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {component.price.toLocaleString()} ₽
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeComponent(category as ComponentCategory)}
                              className="h-6 w-6 p-0 text-red-500 hover:bg-red-500/10"
                            >
                              <Icon name="X" className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-3">
                  <Button
                    onClick={checkCompatibility}
                    className="w-full bg-gaming-accent-green hover:bg-gaming-accent-green/80 text-white font-semibold"
                    disabled={Object.keys(selectedComponents).length === 0}
                  >
                    <Icon name="CheckCircle" className="mr-2 h-4 w-4" />
                    Проверить совместимость
                  </Button>

                  <div className="space-y-2">
                    <Select value={selectedMarketplace} onValueChange={setSelectedMarketplace}>
                      <SelectTrigger className="border-gaming-purple/30">
                        <SelectValue placeholder="Выберите маркетплейс" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Все маркетплейсы</SelectItem>
                        <SelectItem value="ozon">Ozon</SelectItem>
                        <SelectItem value="wildberries">Wildberries</SelectItem>
                        <SelectItem value="yandex">Яндекс Маркет</SelectItem>
                        <SelectItem value="dns">DNS</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <Button
                      onClick={findPCsOnMarketplaces}
                      className="w-full bg-gaming-gradient hover:opacity-90 text-white font-semibold"
                      disabled={Object.keys(selectedComponents).length === 0}
                    >
                      <Icon name="Search" className="mr-2 h-4 w-4" />
                      Найти ПК
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Builds Tab */}
          <TabsContent value="builds">
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Сборки пользователей</h2>
                <Button className="bg-gaming-gradient hover:opacity-90 text-white">
                  <Icon name="Plus" className="mr-2 h-4 w-4" />
                  Добавить сборку
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {builds.map(build => (
                  <Card key={build.id} className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 border-gaming-purple/30 hover:shadow-xl transition-all duration-300">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg text-gaming-purple">{build.name}</CardTitle>
                          <p className="text-sm text-muted-foreground">by {build.author}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="Heart" className="h-4 w-4 text-red-500" />
                          <span className="text-sm font-medium">{build.likes}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {Object.entries(build.components).map(([category, component]) => (
                          <div key={category} className="flex justify-between">
                            <span className="text-muted-foreground">
                              {categoryNames[category as ComponentCategory]}:
                            </span>
                            <span className="font-medium truncate ml-2">
                              {component?.name || 'Не указано'}
                            </span>
                          </div>
                        ))}
                      </div>
                      <Separator className="my-4" />
                      <div className="flex justify-between items-center">
                        <div className="text-xl font-bold text-gaming-purple">
                          {build.totalPrice.toLocaleString()} ₽
                        </div>
                        <div className="space-x-2">
                          <Button variant="outline" size="sm" className="border-gaming-purple/30 hover:bg-gaming-purple/10">
                            <Icon name="Heart" className="h-3 w-3" />
                          </Button>
                          <Button variant="outline" size="sm" className="border-gaming-purple/30 hover:bg-gaming-purple/10">
                            <Icon name="Copy" className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
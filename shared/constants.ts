export const DEFAULT_PAGINATION_OFFSET = 0;
export const DEFAULT_PAGINATION_LIMIT = 20;
export const DEFAULT_PAGINATION = {
  limit: DEFAULT_PAGINATION_LIMIT,
  offset: DEFAULT_PAGINATION_OFFSET,
};

export const TABLE_STATE_STORAGE_KEY = 'tableState';
export const DEFAULT_DEBOUNCE_TIMEOUT = 500;
export const DASHBOARD_STATE_STORAGE_KEY = 'dashboardState';
export const NOTIFICATIONS_STATE_STORAGE_KEY = 'notificationsState';
export const CHANGE_LOG_ACTIONS_STATE_STORAGE_KEY = 'changeLogState';
export const BLURRED_IMAGE =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAAAAAAAAAAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDABQODxIPDRQSEBIXFRQYHjIhHhwcHj0sLiQySUBMS0dARkVQWnNiUFVtVkVGZIhlbXd7gYKBTmCNl4x9lnN+gXz/2wBDARUXFx4aHjshITt8U0ZTfHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHx8fHz/wAARCAGWAooDASIAAhEBAxEB/8QAGQABAQEBAQEAAAAAAAAAAAAAAAECBAMF/8QAFhABAQEAAAAAAAAAAAAAAAAAAAER/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAEC/8QAFhEBAQEAAAAAAAAAAAAAAAAAAAER/9oADAMBAAIRAxEAPwDiAZbAAUBQVFAVFAABQAUAFAFFRQAAAAAAEVAAQBFQBFQERUERFSgiVazQSpVqUErNWpQZqVazUErNarNBmpVrNBms1qs0GazWqzUErNWpUVmoqKoAoKigsajMaiDUWMxqA1FiRYo1FiRYqKqKCqigqoAqoooACiAO4BGQBRRFAVAFABQAURQURQURQABVEAUQBRAAABAAQAQEARUERFZoIlVKCVKtZoJUq1mglZrVZqCVmrUoM1mtVmgzWa1WaDNZrVZqDNSrWaioi1GgEBVVFBY1GViDUajMagNRYzGoosajMWKjSooKqKCiKCgAoigAA7QBBUAUAFEUBUAVUAUAFEUFEUFEBVEUAAAEBUAAEARUAQARFQREVARBASpVqUErNWpQZqVazUErNarNBKzVrNBKzVrNBms1qs1BmpVrNFRFRQAAVFFVqMxYg3FjMagNRYkWKNRWY1FRVRQVUUFVAFVAFAAVAHaAIogCiKCiKCiAKqAKqAKIoKIoKIAogKogCiAKgACAAgIIIAggCCAIJQSpVqUErNWs0EqVazQSs1qs1BKzVrNBKxWqzQZrNarFQSs1azVigIoogCgILFjLUFajUYjUQbixmNRUaixmNQGlZVRoRQVUAVUAVUAUQB2gCCoAogDQgCqgCqyoKIoKIAqoAogDQgCiAKIACAKggKggAgAggCCAMqgJUpUoJUpUoJUpUoJWatZoJWatZqCVmrWaCVitVioJUKiqAKgAIKgKqxBGmo1GI1AbjUYjUEbixmLAaVmNKKqANKyoKqAKIoKIA7RARRAFVAFEAaEAaEAVUAURQUQBRFBRAFEAUQAEAVBAVBAAQBBAEEASlSglSlSgVmrWaBWatZoJUpUoJWK1WKCVmrWbUGbWatrNBARUtARU1RAFVBDVVAaVqMrEabjUYlagjcWMxYDcVmKo0rKg0IA0IA0IAogDtEBFEUFEAURQUQBoQBoZUFVlQUQBVZUFEAUQBUEBRAFQQFQQAQAQQBDUAqUSglSlSgVmrWaBWatZoJWatrNoJWbVtZtBLWLVtYtQS1BFS0QFZAAAAAAVWVFlVUEalalblecalRXpKsYlalBuKxK0DSsqqNCANCANCAKIA7RAFVlQUQBVZUFEAaGVBVZAaNTTQaGdXQUTTQVdZNBoZ0BRAFETQUTTQBNNA1NNTQXU1NQFREBWRAKlKlBKlKloJalpazaIWs2lrNoFrFq2sWipaxatrICArAAAAAAAAAACqyosqrEEalblalYlalRW5VlYlalEb1WNXQbGdXQaE00GhDQUQUdogIqsgNCAKIA0ICqrIDQgDQyoLpqANaayA1prOmg1prOmg1prOmgumppoLqammgupqaaBpqJoLqGpoCaamgIazaC2s2lqWgWs2lqWiFrNpazaBazaWsWgWsWlrNoqVFRWaACAAAAAAAAAAAAKIC601KwqNa9JVlecrUqD0lXWJV0G9XWNXQa1dZ00GtNTQGtNZAdwg0iiCCqyA0IAqsgNCANDOqKohoNaMmg1pqaaCiaaCmppoLpqamgumppoLqammoLqaamqLqampoLqaamgammpohqWpqWgWpaWpaBazaWs2gWs2lrNoFrFpaxaoWoIJaACAAAAAAAAAAAAAAAACoA1qysLqNa9JVlYlWVBvV1jV0G9XWNXQa01nV0GtNZ00HeayNDQgCiAKrOmoNCaaCqzpoNaagC6us6aDWms6aDWmppoq6ammgumppoLprOmojWpqaaC6mppoLqammgupqamgupqaaoammpoGpalqWgWpaWs2gWs2lrNoFrNpaxaoWsiCWgAgAAAAAAAAAAAAAAAAAAAAACrKyA3q6xq6mLrerrGrqYNausauoNaazpoPoaJpraqJpoNDOmg0JpoLpqANaayINaahoNaayaDWmoAumpoCiALpqaagums6aC6ammgupqaaC6mpqaC6ampoLqampoLqWpqWqLazaWs2gtrNpazaBazaWsWgWsiKmgAgAAAAAAAAAAAAAAAAAAAAAAAAAAACmoA1prKoNaayGD6OmoarS6usgNaayoLpqANaMqCiCCqyA1pqaaC6ammgurrOmg1prOmoLpqaaC6aiAumoAupqaAupqaaBpqamgupqamgus2mpaoWs2lrNoi2sWlrFoFqIKAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD6AgKomgKJpoNDOroKJpoKusgNaagirogCqyA0IAuiAKmoILpqALqagC6moAupqAGpoghqaaloFqWpaloFrNpaxaoWsgqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO7TWQVoZUFEAUQBoQBRAGhnVQUQBTUAU1AF0QBRAFEEAQAEAE0QF1NRANSlS0C1m0tZtAtZpUaQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB1iAqqyoKIAogDQgCiKAqAKIqAACiAKIAqAAIAAgAIgIqAMqgJUpUoiWs1ayogCgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADpVAFEAURQFQBRFBRAFABRFQAAAAAAAAAAQABABEVARFSglZrVZoM1FqCIAqgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOgAQABRFAVAFAFURQFRQAAUBAAAAAAAABBUARUBEaQESqlBms1us0Rio1UqjIAoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD3AGRUUAAVQAUAFAAUBQFAAAFAAAAAEUBBUBBUBEaQERUBmpWkojFZrdZojKNVkaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe4AyAoAKACgAooCgAoAKKAACgAAAACKAgoCIoCIoDKNIDKVpBGKzY9KzYDFZrdZoMioKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9wUYAAFAUUAFAVQAUFAAFFAAUAAAAAABBQERpARGkBEaQGUaSiM1mts0GLGa3WaqMVGqlRUAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdAAwAoAKKAoCgKKAKCgACigAoAAoIKAgoCCoCCgIigMioCIoDNZrVQRms1us1UedStVKgwLUGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHQoDAAgoCqoAKCgKAooAKAooAKAAKCCgIKAgqAIoCIoCIqAiNIDKVpKIxUrVZoMVmt1mqjNZaqIsQAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB0gIwKACooooKKACgooqKAqKKKAAKAAAAAAAACCoAigIioCI0gMpWkoM1mtVKIxWa3WKIzWa1WaLEAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdICMKAAoCqAoqooCooqgAoAqgAKAAKAAAACCoAACAAgAIioCIqAzUrVZojNZrVZojNZrVZoRkAaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFHSAywoAKAKoCiqACgKoAKAKoAKAAoAAAAAIAAACAAgAiACIAJWaAjNZoCM1mgEZAGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABR//9k=';

export const DEFAULT_ELEVATOR_MAINTENANCE_INTERVAL = 6; // 6 months

/**
 * Elevator maintenance intervals (months) mapped by elevator type.
 *
 * Grouping rationale:
 * - Standard: common elevators used regularly but not extreme loads (Passenger, Service, Home, Dumbwaiter, Hydraulic, Traction, Inclined, Pneumatic, Modular, Car Lift, Vertical Platform Lift, Elevator Platform, Auto-Elevator, Smart Lift, Virtual Elevator, Elevator With Storage Space, Battery Powered Lift, Floating Lift) → 6 months.
 * - Heavy / High-Usage: large or fast elevators that experience frequent/heavy use (Freight, Industrial, Cargo, Ultra High-Speed, Cargo Platform, Factory, Car Parking, Express, Baggage) → 4 months.
 * - Scenic / Observation: specialized lifts prioritizing user experience or tourism (Glass, Panoramic, Scenic, Observation, Elevator With Glass Panels, Revolving) → 8 months.
 * - Simple / Low Usage: small, rarely used, or basic lifts (Miniature, Elevator Chairlift, Moving Platform, Spiral, Tele-Elevator, Theater, Stadium, Retail, Sidewalk, Circular) → 12 months.
 * - Specialized: unique or eco-friendly designs (Vacuum, Rope-less, Solar-Powered, Eco-Friendly, Cold Storage, Ship, Fire Escape, Medical, Marble, Entertainment, Solar, Heavy Duty) → 6 months, adjust based on design.
 * - Medical / Safety Critical: elevators used for life-safety or hospital purposes (Hospital, Elevator Stretcher) → 3 months.
 *
 * Purpose:
 * This mapping allows automated calculation of next maintenance date per elevator type,
 * ensuring realistic, safe, and optimized maintenance schedules without storing identical intervals per type.
 */

export const ELEVATOR_MAINTENANCE_INTERVALS: Record<string, number> = {
  // Standard
  'Passenger Elevator': 6,
  'Service Elevator': 6,
  'Home Lift': 6,
  'Dumbwaiter Lift': 6,
  'Hydraulic Elevator': 6,
  'Traction Elevator': 6,
  'Inclined Elevator': 6,
  'Pneumatic Elevator': 6,
  'Modular Elevator': 6,
  'Car Lift': 6,
  'Vertical Platform Lift': 6,
  'Elevator Platform': 6,
  'Auto-Elevator': 6,
  'Smart Lift': 6,
  'Virtual Elevator': 6,
  'Elevator With Storage Space': 6,
  'Battery Powered Lift': 6,
  'Floating Lift': 6,

  // Heavy / High-Usage
  'Freight Elevator': 4,
  'Industrial Elevator': 4,
  'Cargo Lift': 4,
  'Ultra High-Speed Elevator': 4,
  'Cargo Platform Lift': 4,
  'Factory Lift': 4,
  'Car Parking Lift': 4,
  'Express Lift': 4,
  'Baggage Lift': 4,

  // Scenic / Observation
  'Glass Elevator': 8,
  'Panoramic Lift': 8,
  'Scenic Elevator': 8,
  'Observation Elevator': 8,
  'Elevator With Glass Panels': 8,
  'Revolving Lift': 8,

  // Simple / Low Usage
  'Miniature Elevator': 12,
  'Elevator Chairlift': 12,
  'Moving Platform': 12,
  'Spiral Lift': 12,
  'Tele-Elevator': 12,
  'Theater Lift': 12,
  'Stadium Lift': 12,
  'Retail Lift': 12,
  'Sidewalk Elevator': 12,
  'Circular Elevator': 12,

  // Specialized / Misc
  'Vacuum Elevator': 6,
  'Rope-less Elevator': 6,
  'Solar-Powered Lift': 6,
  'Eco-Friendly Elevator': 6,
  'Cold Storage Lift': 6,
  'Ship Elevator': 6,
  'Fire Escape Lift': 6,
  'Medical Lift': 6,
  'Marble Elevator': 6,
  'Entertainment Elevator': 6,
  'Solar Lift': 6,
  'Heavy Duty Lift': 6,

  // Medical / Safety Critical
  'Hospital Elevator': 3,
  'Elevator Stretcher': 3,
};

export const DEFAULT_DATA_LOAD_STATUS_ERROR_TITLE = 'Error occurred!';
export const DEFAULT_QUERY_POLL_INTERVAL = 60 * 60 * 1000; // 1 hour

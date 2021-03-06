
using AspNetNgStarter.Features.Core;
using MediatR;
using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;

namespace AspNetNgStarter
{
    public class UnityConfiguration
    {
        public static IUnityContainer GetContainer()
        {
            var container = new UnityContainer();            
            container.AddMediator<UnityConfiguration>();

            container.RegisterType<HttpClient>(
                new ContainerControlledLifetimeManager(),
                new InjectionFactory(x => {

                    return new HttpClient();
                }));

            container.RegisterType<ICache>(
                new ContainerControlledLifetimeManager(),
                new InjectionFactory(x => {
                    return new MemoryCache();
                }));


            return container;
        }
    }

    public static class UnityContainerExtension
    {
        public static IUnityContainer AddMediator<T>(this IUnityContainer container)
        {
            var classes = AllClasses.FromAssemblies(typeof(T).Assembly)
                .Where(x => x.Name.Contains("Controller") == false
                && x.Name.Contains("Attribute") == false
                && x.Name.EndsWith("Hub") == false
                && x.Name.EndsWith("Message") == false
                && x.Name.EndsWith("Cache") == false
                && x.Name.EndsWith("EventBusMessageHandler") == false
                && x.FullName.Contains("Model") == false)
                .ToList();

            return container.RegisterClassesTypesAndInstances(classes);
        }

        public static IUnityContainer RegisterClassesTypesAndInstances(this IUnityContainer container, IList<Type> classes)
        {
            container.RegisterClasses(classes);
            container.RegisterType<IMediator, Mediator>();
            container.RegisterInstance<SingleInstanceFactory>(t => container.IsRegistered(t) ? container.Resolve(t) : null);
            container.RegisterInstance<MultiInstanceFactory>(t => container.ResolveAll(t));
            return container;
        }

        public static void RegisterClasses(this IUnityContainer container, IList<Type> types)
            => container.RegisterTypes(types, WithMappings.FromAllInterfaces, container.GetName, container.GetLifetimeManager);

        public static bool IsNotificationHandler(this IUnityContainer container, Type type)
            => type.GetInterfaces().Any(x => x.IsGenericType && (x.GetGenericTypeDefinition() == typeof(INotificationHandler<>) || x.GetGenericTypeDefinition() == typeof(IAsyncNotificationHandler<>)));

        public static LifetimeManager GetLifetimeManager(this IUnityContainer container, Type type)
            => container.IsNotificationHandler(type) ? new ContainerControlledLifetimeManager() : null;

        public static string GetName(this IUnityContainer container, Type type)
            => container.IsNotificationHandler(type) ? string.Format("HandlerFor" + type.Name) : string.Empty;
    }
}

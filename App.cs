﻿using AspNetNgStarter.Features.Core;

using MediatR;
using Microsoft.AspNet.SignalR;
using Microsoft.AspNet.SignalR.Infrastructure;
using Microsoft.Owin.Cors;
using Microsoft.Owin.Security.Jwt;
using Microsoft.Owin.Security.OAuth;
using Microsoft.Practices.Unity;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json.Serialization;
using Owin;
using Swashbuckle.Application;
using System;
using System.Net.Http;
using System.Reflection;
using System.Web.Http;

using static AspNetNgStarter.UnityConfiguration;

namespace AspNetNgStarter
{
    public class ApiConfiguration
    {
        public static void Install(HttpConfiguration config, IAppBuilder app)
        {
            WebApiUnityActionFilterProvider.RegisterFilterProviders(config);
            var container = GetContainer();

            var httpClient = container.Resolve<HttpClient>();

            var response = httpClient.GetAsync("http://identity.quinntynebrown.com/api/symetrickeys/get").Result;
            var jObject = response.Content.ReadAsAsync<JObject>().Result;

            app.UseCors(CorsOptions.AllowAll);

            app.MapSignalR();

            app.Use(typeof(StatusMiddleware));

            config.Filters.Add(new HandleErrorAttribute(container.Resolve<ILoggerFactory>()));

            
            
            config.SuppressHostPrincipal();

            var mediator = container.Resolve<IMediator>();

            config.EnableSwagger(c => {
                c.UseFullTypeNameInSchemaIds();
                c.SingleApiVersion("v1", "AspNetNgStarter");
            })
            .EnableSwaggerUi();
        
            app.UseJwtBearerAuthentication(new JwtOptions("all", "http://identity.quinntynebrown.com", $"{jObject["key"]}"));

            config.Filters.Add(new HostAuthenticationFilter(OAuthDefaults.AuthenticationType));

            config.Filters.Add(new System.Web.Http.AuthorizeAttribute());

            var jSettings = new JsonSerializerSettings();
            jSettings.Formatting = Formatting.Indented;
            jSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
            jSettings.ContractResolver = new SignalRContractResolver();
            config.Formatters.JsonFormatter.SerializerSettings = jSettings;

            
            config.Formatters.Remove(config.Formatters.XmlFormatter);

            GlobalHost.DependencyResolver.Register(typeof(JsonSerializer), () => JsonSerializer.Create(jSettings));

            config.MapHttpAttributeRoutes();
        }
    }

    public class JwtOptions : JwtBearerAuthenticationOptions
    {
        public JwtOptions(string audience, string issuer, string symetricKey)
        {
            AllowedAudiences = new[] { audience };
            IssuerSecurityTokenProviders = new[]
            {
                new SymmetricKeyIssuerSecurityTokenProvider(issuer,symetricKey)
            };
        }

    }

    public class SignalRContractResolver : IContractResolver
    {
        private readonly Assembly assembly;
        private readonly IContractResolver camelCaseContractResolver;
        private readonly IContractResolver defaultContractSerializer;

        public SignalRContractResolver()
        {
            defaultContractSerializer = new DefaultContractResolver();
            camelCaseContractResolver = new CamelCasePropertyNamesContractResolver();
            assembly = typeof(Connection).Assembly;
        }

        public JsonContract ResolveContract(Type type)
        {
            if (type.Assembly.Equals(assembly))
            {
                return defaultContractSerializer.ResolveContract(type);
            }
            return camelCaseContractResolver.ResolveContract(type);
        }
    }

    public class Constants
    {
        public static string VERSION = "1.0.0-alpha.0";
        public const int CacheOutputClientTimeSpan = 3600;
        public const int CacheOutputServerTimeSpan = 3600;
        public const int MaxStringLength = 255;
    }
}

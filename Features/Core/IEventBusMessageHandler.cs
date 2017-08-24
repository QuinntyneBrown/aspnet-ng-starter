using Newtonsoft.Json.Linq;

namespace AspNetNgStarter.Features.Core
{
    public interface IEventBusMessageHandler
    {
        void Handle(JObject message);
    }
}
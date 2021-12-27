import React from 'react'

import { useToken } from '@chakra-ui/system'

export const PoweredByTribe = ({ color }: { color?: string }) => {
  const [labelPrimaryColor] = useToken('colors', ['label.primary'])

  return (
    <svg width="128" height="12" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1.21781 4.805V1.78534h1.76457c1.05626 0 1.70245.59647 1.70245 1.52847 0 .90714-.64619 1.49119-1.70245 1.49119H1.21781zm1.98825 1.09354c1.62789 0 2.72143-1.10597 2.72143-2.59716 0-1.47876-1.09354-2.609585-2.72143-2.609585H0V9.50225h1.21781V5.89854h1.98825zM9.4981 8.64482c-.99413 0-1.86399-.7456-1.86399-2.13738 0-1.37935.86986-2.12495 1.86399-2.12495.9941 0 1.864.7456 1.864 2.12495 0 1.39178-.8699 2.13738-1.864 2.13738zm0-5.30616c-1.78943 0-3.05695 1.3545-3.05695 3.16878 0 1.82671 1.26752 3.18121 3.05695 3.18121 1.7894 0 3.0569-1.3545 3.0569-3.18121 0-1.81428-1.2675-3.16878-3.0569-3.16878zM17.4677 3.52506l-1.5533 4.49843-1.3421-4.49843h-1.2799l1.9634 5.97719h1.2302l1.5533-4.54813 1.5906 4.54813h1.2054l1.9386-5.97719h-1.2303l-1.3172 4.49843-1.5533-4.49843h-1.2054zM24.7704 5.89854c.0497-.77045.6462-1.52847 1.6279-1.52847 1.0562 0 1.6154.67103 1.6403 1.52847h-3.2682zm3.4422 1.55332c-.2237.67104-.7084 1.20538-1.6776 1.20538-1.0066 0-1.777-.74559-1.8019-1.81428h4.4984c.0125-.07456.0249-.22368.0249-.3728 0-1.86399-1.0314-3.1315-2.8706-3.1315-1.5036 0-2.8581 1.27994-2.8581 3.15636 0 2.02553 1.4042 3.19363 3.0073 3.19363 1.3917 0 2.3486-.83258 2.6841-1.88884l-1.0065-.34795zM34.0391 3.46293c-.0622-.01243-.2237-.03728-.3852-.03728-.609 0-1.3545.22368-1.7895 1.14324V3.52506h-1.1432v5.97719h1.1681V6.50744c0-1.31722.6586-1.83913 1.6403-1.83913.1615 0 .3355.01242.5095.03728V3.46293zM35.9713 5.89854c.0497-.77045.6462-1.52847 1.6279-1.52847 1.0563 0 1.6155.67103 1.6403 1.52847h-3.2682zm3.4422 1.55332c-.2237.67104-.7083 1.20538-1.6776 1.20538-1.0066 0-1.777-.74559-1.8019-1.81428h4.4985c.0124-.07456.0248-.22368.0248-.3728 0-1.86399-1.0314-3.1315-2.8705-3.1315-1.5036 0-2.8581 1.27994-2.8581 3.15636 0 2.02553 1.4042 3.19363 3.0072 3.19363 1.3918 0 2.3486-.83258 2.6841-1.88884l-1.0065-.34795zM42.7298 6.49502c0-1.23024.6959-2.1001 1.7646-2.1001s1.7149.84501 1.7149 2.07524c0 1.23024-.6586 2.16223-1.7273 2.16223-1.1184 0-1.7522-.90714-1.7522-2.13737zm3.4919 2.1995c0 .36038.0373.67104.0621.80773h1.1309c-.0125-.09941-.0622-.53434-.0622-1.10596V.505396h-1.1557V4.37007c-.1988-.48464-.7704-1.00656-1.8267-1.00656-1.69 0-2.8332 1.44149-2.8332 3.13151 0 1.777 1.0811 3.16878 2.8332 3.16878.932 0 1.5658-.49707 1.8516-1.06869v.09941zM53.5384 9.50225v-.86986c.3728.64618 1.0563 1.03141 1.9386 1.03141 1.777 0 2.7836-1.40421 2.7836-3.18121 0-1.73972-.932-3.1315-2.7463-3.1315-.9942 0-1.69.48463-1.9759 1.01898V.505396h-1.1556V9.50225h1.1556zm3.5292-3.01966c0 1.29237-.6959 2.13738-1.7646 2.13738-1.0314 0-1.777-.84501-1.777-2.13738 0-1.29237.7456-2.1001 1.777-2.1001 1.0811 0 1.7646.80773 1.7646 2.1001zM61.1957 12l3.8895-8.47494h-1.2551l-1.7894 4.12563-1.864-4.12563h-1.3421l2.5723 5.31858L59.9157 12h1.28zM93.7999 1.41102h-2.2047l-.0127.77483v2.62467l.0127.68658v3.1307c0 1.4551.9259 2.3517 2.4398 2.3517.7056 0 1.073-.1617 1.1612-.2058V8.92176c-.1323.0294-.3528.07349-.5879.07349-.4851 0-.8084-.16167-.8084-.7643V5.4971h1.4257V3.54225h-1.4257V1.41102zM101.378 3.54225c-.147-.0441-.368-.07349-.588-.07349-.588 0-1.5143.23517-1.8964 1.05826v-.98477H96.733v7.30495h2.2341V7.65772c0-1.45511.8084-1.98424 1.7049-1.98424.221 0 .456.0147.706.07349V3.54225zM104.866 10.8472V3.54225h-2.234v7.30495h2.234zm-2.425-9.53907c0 .72021.588 1.30814 1.294 1.30814.735 0 1.322-.58793 1.322-1.30814C105.057.587925 104.47 0 103.735 0c-.706 0-1.294.587925-1.294 1.30813zM108.912 10.8472v-.8231c.338.5586 1.088.9848 2.058.9848 2.043 0 3.484-1.6021 3.484-3.83621 0-2.19002-1.279-3.80682-3.396-3.80682-.999 0-1.808.41155-2.116.86719V.205774h-2.19V10.8472h2.16zm3.308-3.65982c0 1.21995-.78 1.82257-1.647 1.82257s-1.661-.61732-1.661-1.82257c0-1.23464.794-1.80787 1.661-1.80787s1.647.57323 1.647 1.80787zM117.746 6.3202c.044-.54384.514-1.23465 1.455-1.23465 1.058 0 1.441.67612 1.47 1.23465h-2.925zm3.087 1.89605c-.206.57323-.662.95538-1.47.95538-.867 0-1.617-.58792-1.661-1.41102h5.085c.015-.04409.045-.38215.045-.69081 0-2.3517-1.397-3.74802-3.66-3.74802-1.896 0-3.645 1.49921-3.645 3.85091 0 2.45458 1.793 3.89501 3.806 3.89501 1.852 0 3.014-1.0583 3.366-2.32231l-1.866-.52914zM123.997 9.46559c0 .80841.676 1.51391 1.5 1.51391.823 0 1.513-.7055 1.513-1.51391 0-.82309-.69-1.49921-1.513-1.49921-.824 0-1.5.67612-1.5 1.49921zM82.4977 8.20182c.676-.15395 1.396-.54608 2.0833-.53156v.01598c.343.00726.6619.41537.428.72326-.9438 1.23885-3.7358 1.24466-5.1813 1.35794-2.1216.16557-4.2928.25266-6.4158.08714-.4252-.0334-.5853-.69131-.1077-.76974l5.7681-.4357c1.1437-.09005 2.3058-.19026 3.4254-.44732zM82.0371 5.21581c.6775-.17428 1.4002-.60127 2.0947-.58674l-.0029-.00436c.3473.00872.6265.40085.4181.70584-.873 1.28096-3.8293 1.37246-5.2494 1.49591-2.1471.1888-4.4118.32387-6.5617.07261-.4635-.05373-.4621-.64193 0-.69712l6.1748-.47201c1.0473-.122 2.106-.2498 3.1264-.51413zM82.0981 2.29516c.6349-.15976 1.24-.52284 1.8849-.59546l-.0029-.00145c.4252-.04647.5698.44151.4365.73779-.6009 1.32743-3.9384 1.39424-5.153 1.53948l-6.6638.67969c-.5811.04067-.6066-.74795-.1275-.92223 1.8707-.67679 4.1652-.63322 6.128-.8656 1.1693-.13942 2.3569-.28175 3.4978-.57222z"
        fill={color || labelPrimaryColor}
      />
    </svg>
  )
}

export default PoweredByTribe

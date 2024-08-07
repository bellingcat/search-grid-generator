<template>
    <v-img height="100" src="@/assets/logo.svg" />
    <h1 class="py-2 font-weight-bold">Bellingcat Search Grid Generator</h1>

    <a href="https://www.bellingcat.com"
        ><img
            alt="Bellingcat logo: Discover Bellingcat"
            src="https://img.shields.io/badge/Discover%20Bellingcat-%20?style=for-the-badge&logo=data%3Aimage%2Fpng%3Bbase64%2CiVBORw0KGgoAAAANSUhEUgAAAA4AAAAYCAYAAADKx8xXAAABhGlDQ1BJQ0MgcHJvZmlsZQAAKJF9kT1Iw0AcxV9TS0UqDnZQEcxQneyiIo6likWwUNoKrTqYXPoFTRqSFBdHwbXg4Mdi1cHFWVcHV0EQ%2FABxdnBSdJES%2F5cUWsR4cNyPd%2Fced%2B8AoVllqtkTA1TNMtKJuJjLr4rBVwQwhhBEDEvM1JOZxSw8x9c9fHy9i%2FIs73N%2Fjn6lYDLAJxLHmG5YxBvEs5uWznmfOMzKkkJ8Tjxp0AWJH7kuu%2FzGueSwwDPDRjY9TxwmFktdLHcxKxsq8QxxRFE1yhdyLiuctzir1Tpr35O%2FMFTQVjJcpzmKBJaQRIo6klFHBVVYiNKqkWIiTftxD%2F%2BI40%2BRSyZXBYwcC6hBheT4wf%2Fgd7dmcXrKTQrFgcCLbX%2BMA8FdoNWw7e9j226dAP5n4Err%2BGtNYO6T9EZHixwBA9vAxXVHk%2FeAyx1g6EmXDMmR%2FDSFYhF4P6NvygODt0Dfmttbex%2BnD0CWulq%2BAQ4OgYkSZa97vLu3u7d%2Fz7T7%2BwHEU3LHAa%2FQ6gAAAAZiS0dEAAAAAAAA%2BUO7fwAAAAlwSFlzAAAuIwAALiMBeKU%2FdgAAAAd0SU1FB%2BgFHwwiMH4odB4AAAAZdEVYdENvbW1lbnQAQ3JlYXRlZCB3aXRoIEdJTVBXgQ4XAAAA50lEQVQ4y82SvWpCQRCFz25ERSJiCNqlUiS1b5AuEEiZIq1NOsGXCKms0wXSp9T6dskDiFikyiPc%2FrMZyf3FXSGQ0%2BzuzPl2ZoeVKgQ0gQ2wBVpVHlcDkjM5V%2FJ5nag6sJ%2FZX%2Bh%2FC7gEhqeAFKf7p1M9aB3b5oN1OomB7g1axUBPBr3GQHODHmOgqUF3MZAzKI2d4LWBV4H%2BMXDuJd1a7Cew1k7SwksaHC4LqNaw7aeX9GWHXkC1G1sTAS17Y3Kk2lnp4wNLiz0DrgLq8qt2MfmSSabAO%2FBBXp26dtrADPjOmN%2BAUdG7B3cE61l5hOZiAAAAAElFTkSuQmCC&logoColor=%23fff&color=%23000" /></a
    ><a href="https://discord.gg/bellingcat"
        ><img
            alt="Discord logo: Join our community"
            src="https://img.shields.io/badge/Join%20our%20community-%20?style=for-the-badge&logo=discord&logoColor=%23fff&color=%235865F2" /></a
    ><a href="https://github.com/bellingcat/search-grid-generator"
        ><img
            alt="Github logo: Explore the code"
            src="https://img.shields.io/badge/Explore%20the%20code-%20?style=for-the-badge&logo=github&color=%2329903b"
    /></a>

    <!-- Title and Information -->
    <v-card class="mx-auto" max-width="600" variant="text">
        <p class="py-2">
            Use the map to select an area of interest. Optionally adjust the
            grid size and file name. Click the 'Download Search Grid' button to
            download your KML file. This KML file can be opened in Google Earth
            or other GIS tool.
        </p>
    </v-card>
</template>

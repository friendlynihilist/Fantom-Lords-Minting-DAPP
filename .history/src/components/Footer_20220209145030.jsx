import React from "react";

function Footer() {
    return (
        <div className="footer">
            <footer class="py-5 bg-dark fixed-bottom">
                <div class="container">
                <ResponsiveWrapper flex={1} style={{ padding: 40, width: '28%' }}>
          <s.Container
            flex={1}
            jc={'center'}
            ai={'center'}
            style={{ paddingBottom: 20 }}
          >
            <a
              href={'https://discord.gg/R8HvcKAdhB'}
              target={'_blank'}
              style={iconStyle}
            >
              <FontAwesomeIcon
                icon={['fab', 'discord']}
                size="3x"
                style={{ cursor: 'pointer' }}
              />
            </a>
          </s.Container>
          <s.Container
            flex={1}
            jc={'center'}
            ai={'center'}
            style={{ paddingBottom: 20 }}
          >
            <a
              href={'https://twitter.com/ENRINFT'}
              target={'_blank'}
              style={iconStyle}
            >
              <FontAwesomeIcon
                icon={['fab', 'twitter']}
                size="3x"
                style={{ cursor: 'pointer' }}
              />
            </a>
          </s.Container>
        </ResponsiveWrapper>
        <s.SpacerXSmall />
        <ResponsiveWrapper
          flex={1}
          style={{ paddingBottom: 10, width: '100%' }}
        >
          <s.Container flex={1} jc={'center'} ai={'center'}>
            <s.TextDescription
              style={{
                textAlign: 'center',
                color: 'var(--primary-text)',
                textTransform: 'uppercase',
              }}
            >
              Enri's Fantom Lords © {actualYear}
            </s.TextDescription>
            <s.SpacerXSmall />
            <s.TextDescription
              style={{
                textAlign: 'center',
                color: 'var(--primary-text)',
              }}
            >
              developed &amp; designed by 🧙 for 🧙 with ❤️
              <br />
              tune by{' '}
              <a href="#" style={{ color: 'red' }}>
                stray
              </a>
            </s.TextDescription>
          </s.Container>
        </ResponsiveWrapper>
                </div>
            </footer>
        </div>
    );
}

export default Footer;